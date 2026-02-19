// ===== GUARDAR COMENTARIOS EN LOCAL STORAGE =====
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('starForm');
    const commentsDisplay = document.getElementById('commentsDisplay');
    const formMessage = document.getElementById('formMessage');

    // Cargar comentarios guardados al iniciar
    loadComments();

    // Manejar el envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const rating = document.querySelector('input[name="rating"]:checked').value;
        const comment = document.getElementById('comment').value.trim();

        // Validar datos
        if (!name || !rating || !comment) {
            showFormMessage('Por favor completa todos los campos', 'error');
            return;
        }

        // Crear nuevo comentario
        const newComment = {
            id: Date.now(),
            name: name,
            rating: parseInt(rating),
            comment: comment,
            date: new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };

        // Guardar en localStorage
        saveComment(newComment);

        // Mostrar mensaje de éxito
        showFormMessage('¡Comentario enviado exitosamente!', 'success');

        // Limpiar formulario
        form.reset();

        // Recargar comentarios
        loadComments();

        // Desplazarse a los comentarios
        setTimeout(() => {
            commentsDisplay.scrollIntoView({ behavior: 'smooth' });
        }, 1000);
    });

    // Función para guardar comentario
    function saveComment(comment) {
        let comments = getCommentsFromStorage();
        comments.unshift(comment); // Agregar al inicio
        localStorage.setItem('almastralComments', JSON.stringify(comments));
    }

    // Función para obtener comentarios
    function getCommentsFromStorage() {
        const stored = localStorage.getItem('almastralComments');
        return stored ? JSON.parse(stored) : [];
    }

    // Función para cargar y mostrar comentarios
    function loadComments() {
        const comments = getCommentsFromStorage();
        
        if (comments.length === 0) {
            commentsDisplay.innerHTML = '<p class="no-comments">Aún no hay comentarios. ¡Sé el primero en dejar tu opinión!</p>';
            return;
        }

        let html = '';
        comments.forEach(comment => {
            html += `
                <div class="comment-item">
                    <div class="comment-header">
                        <span class="comment-author">${comment.name}</span>
                        <span class="comment-rating">
                            ${'⭐'.repeat(comment.rating)}
                        </span>
                    </div>
                    <p class="comment-text">${comment.comment}</p>
                    <p class="comment-date">${comment.date}</p>
                </div>
            `;
        });

        commentsDisplay.innerHTML = html;
    }

    // Función para mostrar mensaje del formulario
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
});

// ===== SUAVIZAR SCROLL PARA ENLACES DE NAVEGACIÓN =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ===== EFECTO DE APARICIÓN PROGRESIVA =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos
document.querySelectorAll('.testimonial-card, .intro-section, .contact-section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});