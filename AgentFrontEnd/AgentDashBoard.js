
async function getAssignedItems() {
    const container = document.getElementById("assigned-items");

    const agentName = localStorage.getItem("name");

    if (!agentName) {
        container.innerHTML = "<p>Please log in again.</p>";
        return;
    }

    try {
        const email = localStorage.getItem("email")
        const response = await fetch(
            `http://localhost:5000/agent/assigneditems?email=${email}`
        );

        const data = await response.json();

        if (!response.ok) {
            container.innerHTML = "<p>Unable to load assigned items.</p>";
            return;
        }

        if (data.length === 0) {
            container.innerHTML =
                "<p>No items have been assigned to you yet.</p>";
            return;
        }

        container.innerHTML = "";

        data.forEach(function(item) {
            const card = document.createElement("div");
            card.className = "col-md-4";

            card.innerHTML = `
                <div class="card h-100  p-3">
                    <div class="d-flex justify-content-center">
                        <img src ="http://localhost:5000/${item.prod_path}" style="height :100px; width : 120px" />
                    </div>
                    <h5 class="card-title text-center mt-2">
                    <hr>

                        ${item.product_name}
                    </h5>
                    <hr>
                    <p>
                        <strong>Order ID:</strong>
                        ${item.order_id}
                    </p>

                    <p>
                        <strong>Address:</strong>
                        ${item.address}
                    </p>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading assigned items:", error);
        container.innerHTML =
            "<p>Server connection failed. Please try again.</p>";
    }
}

getAssignedItems();
