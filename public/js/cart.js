document.addEventListener("DOMContentLoaded", () => {
    const cartButton = document.getElementById("cartButton");
    cartButton.addEventListener("click", () => {
      try {
        // Retrieve authentication token from localStorage
        const authToken = localStorage.getItem("authToken");
  
        // Redirect to the cart page with the token as a query parameter
        window.location.href = `/usercart?token=${authToken}`;
      } catch (error) {
        console.error("Error redirecting to cart page:", error);
      }
    });
});
  