document.addEventListener('DOMContentLoaded', () => {
    // Get plan details from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const planLevel = urlParams.get('plan');
    const planPrice = urlParams.get('price');

    // Plan configurations
    const planConfigs = {
        basic: {
            name: 'Basic Membership',
            price: '$9.99/month',
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

    // Update page with plan details
    const selectedPlan = planConfigs[planLevel];
    if (selectedPlan) {
        document.getElementById('plan-name').textContent = selectedPlan.name;
        document.getElementById('plan-price').textContent = selectedPlan.price;
        
        const featuresList = document.createElement('ul');
        selectedPlan.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
        document.getElementById('plan-features').innerHTML = '';
        document.getElementById('plan-features').appendChild(featuresList);
    }

    // Handle form submission
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Here you would typically:
        // 1. Validate the form data
        // 2. Send the payment information to your payment processor
        // 3. Create the user account
        // 4. Redirect to a success page or show error
        
        // For now, we'll just show an alert
        alert('Thank you for your purchase! This is a demo - no actual payment was processed.');
        window.location.href = 'dashboard.html';
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
});
