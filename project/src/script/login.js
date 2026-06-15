function showToast(message, type = "success") {

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 2500);
}

loadLoginToast();

function loadLoginToast() {

    fetch("../../php/global.php?getSession=error")

        .then(res => res.json())

        .then(data => {

            if (!data.success || !data.data) return;

            const err = data.data;

            if (err.success) {

                showToast(
                    err.data || "Success",
                    "success"
                );

            } else {

                showToast(
                    err.error || "Error",
                    "error"
                );

            }
        })

        .catch(() => {});
}