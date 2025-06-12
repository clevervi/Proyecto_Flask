document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('collapsed');
    });

    // Initialize Chart
    const salesChart = document.getElementById('salesChart');
    if (salesChart) {
        const ctx = salesChart.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [{
                    label: 'Ventas 2023',
                    data: [6500, 5900, 8000, 8100, 5600, 5500, 4000, 6200, 7800, 9000, 8500, 9500],
                    backgroundColor: 'rgba(74, 118, 168, 0.1)',
                    borderColor: 'rgba(74, 118, 168, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Active menu item
    const menuItems = document.querySelectorAll('.sidebar nav ul li');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Change main content title
            const sectionTitle = this.querySelector('a span').textContent;
            document.querySelector('.admin-header h1').textContent = sectionTitle;
        });
    });

    // Simulate loading
    setTimeout(() => {
        document.querySelectorAll('.card p').forEach((el, index) => {
            el.style.transform = 'translateY(0)';
            el.style.opacity = '1';
        });
    }, 300);

    // Profile dropdown (would need additional HTML/CSS for dropdown)
    const adminProfile = document.querySelector('.admin-profile');
    adminProfile.addEventListener('click', function() {
        alert('Menú de perfil abierto (implementar dropdown)');
    });

    // Notifications
    const notifications = document.querySelector('.notifications');
    notifications.addEventListener('click', function() {
        alert('Mostrar notificaciones');
    });
});