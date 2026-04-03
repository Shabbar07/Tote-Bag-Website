import { observeAuth } from "./auth.js";

function updateNavbar(user) {
    const accountLinks = document.querySelectorAll('a[href^="account"], a[href^="profile"]');
    accountLinks.forEach(link => {
        if (user) {
            link.href = "/tote-bag-shop/profile";
            link.innerHTML = `<i class="fas fa-user"></i> ${user.displayName || user.email.split('@')[0]}`;
            link.title = "View Profile";
        } else {
            // Only update if it's not already pointing to account.html
            if (!link.href.includes("account")) {
                link.href = "/tote-bag-shop/account";
            }
            link.innerHTML = "Account";
            link.title = "Login or Register";
        }
    });
}

// Initial observer
observeAuth(updateNavbar);

export { updateNavbar };
