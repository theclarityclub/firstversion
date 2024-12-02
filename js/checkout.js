document.addEventListener('DOMContentLoaded', () => {
    // Get plan details and reward details from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const planLevel = urlParams.get('plan');
    const planPrice = urlParams.get('price');
    const rewardBadge = urlParams.get('rewardBadge');
    const rewardValue = urlParams.get('rewardValue');

    // Plan configurations
    const planConfigs = {
        basic: {
            name: 'Basic Membership',
            price: '$9.99/month',
            basePrice: 9.99,
            features: [
                'Access to monthly workshops',
                'Basic meditation resources',
                'Community forum access',
                'Monthly newsletter'
            ]
        },
        premium: {
            name: 'Premium Membership',
            price: '$19.99/month',
            basePrice: 19.99,
            features: [
                'All Basic benefits',
                'Weekly group sessions',
                'Premium meditation library',
                'Personal progress tracking',
                'Priority event registration'
            ]
        },
        elite: {
            name: 'Elite Membership',
            price: '$39.99/month',
            basePrice: 39.99,
            features: [
                'All Premium benefits',
                '1-on-1 coaching sessions',
                'Exclusive retreats access',
                'Custom growth plan',
                'Advanced workshops',
                '24/7 support'
            ]
        }
    };

    // Update page with plan details and apply reward if available
    const selectedPlan = planConfigs[planLevel];
    if (selectedPlan) {
        document.getElementById('plan-name').textContent = selectedPlan.name;
        
        // Apply reward discount if available
        if (rewardBadge && rewardValue) {
            const discount = parseFloat(rewardValue) / 100;
            const discountedPrice = selectedPlan.basePrice * (1 - discount);
            const originalPriceElement = document.createElement('span');
            originalPriceElement.className = 'original-price';
            originalPriceElement.textContent = selectedPlan.price;
            
            document.getElementById('plan-price').innerHTML = '';
            document.getElementById('plan-price').appendChild(originalPriceElement);
            document.getElementById('plan-price').appendChild(document.createTextNode(
                ` $${discountedPrice.toFixed(2)}/month (${rewardValue}% off)`
            ));
        } else {
            document.getElementById('plan-price').textContent = selectedPlan.price;
        }
        
        const featuresList = document.createElement('ul');
        selectedPlan.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
        document.getElementById('plan-features').innerHTML = '';
        document.getElementById('plan-features').appendChild(featuresList);
    }

    // Check if user is from challenge
    const challengeEmail = localStorage.getItem('challengeEmail');
    let challengeData = null;

    // Handle form submission
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';

            // Get form data
            const formData = new FormData(form);
            const email = formData.get('email');
            const name = formData.get('name');

            // Here you would typically process payment with Stripe/PayPal
            // For demo, we'll skip payment processing

            // Calculate final price
            let finalPrice = selectedPlan.basePrice;
            if (rewardBadge && rewardValue) {
                const discount = parseFloat(rewardValue) / 100;
                finalPrice = finalPrice * (1 - discount);
            }

            // If user is from challenge, get their data
            if (challengeEmail) {
                const challengeDoc = await db.collection('challenge_participants').doc(challengeEmail).get();
                if (challengeDoc.exists) {
                    challengeData = challengeDoc.data();
                }
            }

            // Create authenticated user
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, formData.get('password'));
            const uid = userCredential.user.uid;

            // Create user document
            await db.collection('users').doc(uid).set({
                email: email,
                name: name,
                plan: planLevel,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                challengeCompleted: challengeData ? true : false,
                appliedReward: rewardBadge ? {
                    badge: rewardBadge,
                    value: parseFloat(rewardValue),
                    appliedAt: firebase.firestore.FieldValue.serverTimestamp()
                } : null
            });

            // Create membership document
            await db.collection('memberships').doc(uid).set({
                plan: planLevel,
                startDate: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active',
                price: finalPrice,
                originalPrice: selectedPlan.basePrice,
                appliedDiscount: rewardBadge ? {
                    badge: rewardBadge,
                    value: parseFloat(rewardValue)
                } : null
            });

            // If user came from challenge, transfer their progress
            if (challengeData) {
                await db.collection('progress').doc(uid).set({
                    challengeProgress: challengeData.completedDays || [],
                    currentDay: challengeData.currentDay || 1,
                    lastCompletionTime: challengeData.lastCompletionTime,
                    badges: challengeData.badges || {},
                    transferredFrom: challengeEmail,
                    transferredAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                // Mark challenge participant record as converted
                await db.collection('challenge_participants').doc(challengeEmail).update({
                    convertedToMember: true,
                    convertedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    membershipUid: uid
                });

                // Clear challenge email from localStorage
                localStorage.removeItem('challengeEmail');
            }

            // If a reward was used, mark the badge as redeemed
            if (rewardBadge) {
                const userProgressRef = firebase.firestore().collection('users').doc(uid);
                await userProgressRef.update({
                    [`badges.${rewardBadge}.redeemed`]: true,
                    [`badges.${rewardBadge}.redeemedAt`]: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            // Show success message
            alert('Account created successfully! Redirecting to dashboard...');
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';

        } catch (error) {
            console.error('Error during checkout:', error);
            alert('An error occurred during checkout. Please try again.');
            
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });

    // Basic form validation
    const cardInput = document.getElementById('card');
    cardInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        e.target.value = formattedValue.slice(0, 19);
    });

    const expiryInput = document.getElementById('expiry');
    expiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });

    const cvvInput = document.getElementById('cvv');
    cvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
    });

    // Pre-fill email if coming from challenge
    if (challengeEmail) {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.value = challengeEmail;
        }
    }
});
