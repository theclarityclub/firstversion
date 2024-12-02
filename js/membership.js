document.addEventListener('DOMContentLoaded', () => {
    // Get reward parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const rewardType = urlParams.get('rewardType');
    const rewardValue = urlParams.get('rewardValue');
    const rewardPlan = urlParams.get('rewardPlan');
    const rewardDuration = urlParams.get('rewardDuration');
    const rewardBadge = urlParams.get('rewardBadge');

    // Plan configurations
    const planConfigs = {
        basic: {
            name: 'Basic',
            price: 9.99,
            selector: '.plan-card:first-child'
        },
        premium: {
            name: 'Premium',
            price: 19.99,
            selector: '.plan-card.featured'
        },
        elite: {
            name: 'Elite',
            price: 39.99,
            selector: '.plan-card:last-child'
        }
    };

    // Apply rewards to pricing
    if (rewardType && (rewardValue || rewardPlan)) {
        Object.entries(planConfigs).forEach(([planKey, plan]) => {
            const planCard = document.querySelector(plan.selector);
            if (!planCard) return;

            const priceElement = planCard.querySelector('.price');
            const ctaButton = planCard.querySelector('.cta-primary');
            
            if (rewardType === 'discount' && rewardValue) {
                // Calculate discounted price
                const discount = parseFloat(rewardValue) / 100;
                const discountedPrice = plan.price * (1 - discount);

                // Update price display
                if (priceElement) {
                    priceElement.innerHTML = `
                        <span class="original-price">$${plan.price.toFixed(2)}</span>
                        $${discountedPrice.toFixed(2)}<span>/month</span>
                        <div class="discount-badge">${rewardValue}% off for ${rewardDuration} months</div>
                    `;
                }

                // Update CTA button link
                if (ctaButton) {
                    ctaButton.href = `checkout.html?plan=${planKey}&price=${plan.price}&rewardType=discount&rewardValue=${rewardValue}&rewardDuration=${rewardDuration}&rewardBadge=${rewardBadge}`;
                }
            } else if (rewardType === 'free' && rewardPlan === planKey) {
                // Update price display for free months
                if (priceElement) {
                    priceElement.innerHTML = `
                        <span class="original-price">$${plan.price.toFixed(2)}</span>
                        $0.00<span>/month</span>
                        <div class="discount-badge">Free for ${rewardDuration} month${rewardDuration > 1 ? 's' : ''}</div>
                    `;
                }

                // Update CTA button link
                if (ctaButton) {
                    ctaButton.href = `checkout.html?plan=${planKey}&price=${plan.price}&rewardType=free&rewardPlan=${rewardPlan}&rewardDuration=${rewardDuration}&rewardBadge=${rewardBadge}`;
                }
            }
        });
    }
});
