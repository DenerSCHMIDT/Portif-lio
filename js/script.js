// Menu Mobile
const menuButton = document.querySelector('.menu-button');
const navMenu = document.querySelector('.nav-menu');

menuButton.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuButton.classList.toggle('active');
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuButton.classList.remove('active');
    });
});

// Animação de scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const headerOffset = 80; // Altura do header
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header fixo com efeito de transparência
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll Down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll Up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Função utilitária para mostrar toast de validação
function showValidationToast(message, type = 'success') {
    // Remove qualquer toast existente
    document.querySelectorAll('.validation-toast').forEach(el => el.remove());

    const toast = document.createElement('div');
    toast.className = `validation-toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button class="close-toast" title="Fechar">&times;</button>
    `;
    document.body.appendChild(toast);

    // Fechar ao clicar no X
    toast.querySelector('.close-toast').onclick = () => toast.remove();

    // Remover automaticamente após 3 segundos
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Formulário de contato
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        const nameInput = contactForm.querySelector('input[name="name"]');
        const emailInput = contactForm.querySelector('input[type="email"]');
        const messageInput = contactForm.querySelector('textarea[name="message"]');
        const name = data.name || '';
        const email = data.email || '';
        const message = data.message || '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Remove mensagens antigas
        contactForm.querySelectorAll('.success-message, .error-message').forEach(el => el.remove());

        if (!name.trim()) {
            showValidationToast('Por favor, preencha o nome.', 'error');
            nameInput.focus();
            return;
        }
        if (!email.trim()) {
            showValidationToast('Por favor, preencha o e-mail.', 'error');
            emailInput.focus();
            return;
        }
        if (!emailRegex.test(email)) {
            showValidationToast('Por favor, insira um e-mail válido.', 'error');
            emailInput.focus();
            return;
        }
        if (!message.trim()) {
            showValidationToast('Por favor, preencha a mensagem.', 'error');
            messageInput.focus();
            return;
        }

        try {
            // Simulação de envio
            console.log('Dados do formulário:', data);
            showValidationToast('Recebemos sua mensagem e em breve entrarei em contato!', 'success');
            contactForm.reset();
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            showValidationToast('Erro ao enviar mensagem. Por favor, tente novamente.', 'error');
        }
    });
}

// Validação de campos em tempo real
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
formInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
            input.classList.add('valid');
        } else {
            input.classList.remove('valid');
        }
    });
});

// Animação de elementos ao scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Verifica se há uma preferência salva
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
} else if (prefersDarkScheme.matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
}

// Alterna o tema
themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    let newTheme = theme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Carrossel de Projetos
document.addEventListener('DOMContentLoaded', function() {
    const projectsGrid = document.querySelector('.projects-grid');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const projects = document.querySelectorAll('.project-card');
    let currentIndex = 0;
    const totalProjects = projects.length;
    let projectsPerView = window.innerWidth > 992 ? 3 : window.innerWidth > 768 ? 2 : 1;

    // Clonar os primeiros e últimos projetos para criar o efeito circular
    function setupCarousel() {
        const firstProjects = Array.from(projects).slice(0, projectsPerView);
        const lastProjects = Array.from(projects).slice(-projectsPerView);
        
        // Adicionar clones no início
        firstProjects.forEach(project => {
            const clone = project.cloneNode(true);
            projectsGrid.insertBefore(clone, projectsGrid.firstChild);
        });
        
        // Adicionar clones no final
        lastProjects.forEach(project => {
            const clone = project.cloneNode(true);
            projectsGrid.appendChild(clone);
        });
        
        // Ajustar o índice inicial para começar nos projetos reais
        currentIndex = projectsPerView;
        updateCarousel();
    }

    function updateCarousel() {
        const cardWidth = 100 / projectsPerView;
        const offset = currentIndex * -cardWidth;
        projectsGrid.style.transform = `translateX(${offset}%)`;
    }

    function nextSlide() {
        currentIndex++;
        updateCarousel();
        
        // Verificar se chegou ao final dos clones
        if (currentIndex >= totalProjects + projectsPerView) {
            setTimeout(() => {
                projectsGrid.style.transition = 'none';
                currentIndex = projectsPerView;
                updateCarousel();
                setTimeout(() => {
                    projectsGrid.style.transition = 'transform 0.5s ease';
                }, 50);
            }, 500);
        }
    }

    function prevSlide() {
        currentIndex--;
        updateCarousel();
        
        // Verificar se chegou ao início dos clones
        if (currentIndex < projectsPerView) {
            setTimeout(() => {
                projectsGrid.style.transition = 'none';
                currentIndex = totalProjects + projectsPerView - 1;
                updateCarousel();
                setTimeout(() => {
                    projectsGrid.style.transition = 'transform 0.5s ease';
                }, 50);
            }, 500);
        }
    }

    // Atualizar o número de projetos por visualização quando a janela for redimensionada
    window.addEventListener('resize', () => {
        const newProjectsPerView = window.innerWidth > 992 ? 3 : window.innerWidth > 768 ? 2 : 1;
        if (newProjectsPerView !== projectsPerView) {
            projectsPerView = newProjectsPerView;
            // Limpar clones existentes
            const allProjects = projectsGrid.querySelectorAll('.project-card');
            const originalProjects = Array.from(allProjects).slice(projectsPerView, -projectsPerView);
            projectsGrid.innerHTML = '';
            originalProjects.forEach(project => projectsGrid.appendChild(project));
            // Recriar o carrossel
            setupCarousel();
        }
    });

    // Configurar o carrossel inicial
    setupCarousel();

    // Configurar o carrossel automático
    let carouselInterval = setInterval(nextSlide, 5000);

    // Event listeners para os botões
    if (nextButton && prevButton) {
        nextButton.addEventListener('click', () => {
            clearInterval(carouselInterval);
            nextSlide();
            carouselInterval = setInterval(nextSlide, 5000);
        });

        prevButton.addEventListener('click', () => {
            clearInterval(carouselInterval);
            prevSlide();
            carouselInterval = setInterval(nextSlide, 5000);
        });
    }

    // Pausar o carrossel quando o mouse estiver sobre ele
    if (projectsGrid) {
        projectsGrid.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });

        projectsGrid.addEventListener('mouseleave', () => {
            carouselInterval = setInterval(nextSlide, 5000);
        });
    }
});

// Configuração do Modal de Habilidades
const skillModal = document.getElementById('skill-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const closeModal = document.querySelector('.close-modal');

// Descrições das habilidades
const skillDescriptions = {
    'Python': 'Python é uma linguagem de programação de alto nível, interpretada e de propósito geral. Me permite desenvolver aplicações web, análise de dados, automação, inteligência artificial e muito mais. Sua sintaxe simples e legível facilita o desenvolvimento rápido de soluções.',
    'C': 'C é uma linguagem de programação de baixo nível e propósito geral. Me permite desenvolver sistemas operacionais, drivers de dispositivo, aplicações embarcadas e software de sistema. É fundamental para entender os conceitos básicos de programação e gerenciamento de memória.',
    'C#': 'C# é uma linguagem de programação moderna, orientada a objetos e fortemente tipada. Me permite desenvolver aplicações desktop, web, mobile e jogos usando o framework .NET. É especialmente poderosa para desenvolvimento de aplicações empresariais.',
    '.NET': '.NET é um framework de desenvolvimento da Microsoft. Me permite criar aplicações multiplataforma, APIs RESTful, aplicações web e serviços em nuvem. Oferece um conjunto robusto de ferramentas e bibliotecas para desenvolvimento.',
    'MongoDB': 'MongoDB é um banco de dados NoSQL orientado a documentos. Me permite armazenar e gerenciar dados não estruturados, escalar horizontalmente e desenvolver aplicações com alta performance. Ideal para big data e aplicações em tempo real.',
    'HTML': 'HTML é a linguagem de marcação padrão para criar páginas web. Me permite estruturar o conteúdo, criar formulários, incorporar mídia e definir a semântica do conteúdo web.',
    'CSS': 'CSS é uma linguagem de estilo usada para descrever a apresentação de documentos HTML. Me permite criar layouts responsivos, animações, transições e estilizar elementos web de forma moderna e profissional.',
    'Node.js': 'Node.js é um ambiente de execução JavaScript server-side. Me permite desenvolver aplicações web escaláveis, APIs RESTful e aplicações em tempo real usando JavaScript tanto no frontend quanto no backend.',
    'Angular': 'Angular é um framework JavaScript para construção de aplicações web. Me permite desenvolver aplicações SPA (Single Page Applications) robustas, com gerenciamento de estado, roteamento e componentes reutilizáveis.',
    'React': 'React é uma biblioteca JavaScript para construção de interfaces de usuário. Me permite criar componentes reutilizáveis, gerenciar o estado da aplicação e desenvolver interfaces interativas e responsivas.',
    'Studio 3T': 'Studio 3T é uma IDE para MongoDB. Me permite gerenciar bancos de dados MongoDB, criar queries complexas, importar/exportar dados e visualizar a estrutura do banco de forma intuitiva.',
    'SaaS': 'Software as a Service (SaaS) é um modelo de distribuição de software. Me permite desenvolver e manter aplicações web acessíveis via internet, com atualizações centralizadas e escalabilidade.',
    'Sistema ERP': 'ERP (Enterprise Resource Planning) é um sistema integrado de gestão empresarial. Me permite desenvolver soluções que integram diferentes áreas da empresa, como finanças, vendas, estoque e recursos humanos.',
    'TypeScript': 'TypeScript é um superset do JavaScript que adiciona tipagem estática. Me permite desenvolver aplicações mais robustas, com melhor manutenibilidade e detecção de erros em tempo de desenvolvimento.',
    'Bootstrap': 'Bootstrap é um framework CSS para desenvolvimento frontend. Me permite criar interfaces responsivas e modernas rapidamente, com componentes pré-estilizados e um sistema de grid flexível.',
    'Trello': 'Trello é uma ferramenta de gerenciamento de projetos. Me permite organizar tarefas, colaborar com equipes e gerenciar o fluxo de trabalho de forma visual e eficiente.',
    'Figma': 'Figma é uma ferramenta de design de interface. Me permite criar protótipos, colaborar em tempo real e desenvolver interfaces de usuário modernas e intuitivas.',
    'AWS': 'Amazon Web Services é uma plataforma de computação em nuvem. Me permite desenvolver, implantar e escalar aplicações usando serviços como EC2, S3, Lambda e outros recursos de infraestrutura.',
    'Postman': 'Postman é uma plataforma para desenvolvimento de APIs. Me permite testar, documentar e compartilhar APIs, além de automatizar testes de integração.',
    'Linux': 'Linux é um sistema operacional open-source. Me permite desenvolver em um ambiente Unix-like, gerenciar servidores e trabalhar com ferramentas de linha de comando poderosas.',
    'Windows': 'Windows é um sistema operacional da Microsoft. Me permite desenvolver aplicações desktop, gerenciar sistemas e trabalhar com ferramentas específicas da plataforma.',
    'VMS': 'Virtual Machine System é uma plataforma de virtualização. Me permite criar e gerenciar máquinas virtuais, testar aplicações em diferentes ambientes e isolar recursos.',
    'ProxMox': 'ProxMox é uma plataforma de virtualização open-source. Me permite gerenciar servidores virtuais, containers e recursos de rede de forma eficiente.',
    'Terminus': 'Terminus é um terminal moderno e personalizável. Me permite gerenciar múltiplas sessões, automatizar tarefas e trabalhar com diferentes shells de forma eficiente.'
};

// Adicionar evento de clique para cada card de habilidade
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('click', () => {
        const skillName = card.querySelector('.skill-card-back span').textContent;
        modalTitle.textContent = skillName;
        modalDescription.textContent = skillDescriptions[skillName] || 'Descrição não disponível.';
        skillModal.classList.add('active');
    });
});

// Fechar modal
closeModal.addEventListener('click', () => {
    skillModal.classList.remove('active');
});

// Fechar modal ao clicar fora dele
skillModal.addEventListener('click', (e) => {
    if (e.target === skillModal) {
        skillModal.classList.remove('active');
    }
});

// Fechar modal com a tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && skillModal.classList.contains('active')) {
        skillModal.classList.remove('active');
    }
});
