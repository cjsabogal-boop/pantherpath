// ===========================
// INTERNATIONALIZATION (i18n)
// ===========================

let currentLang = localStorage.getItem('language') || 'es';

// Embedded translations (to work without a server)
const translations = {
    "es": {
        "nav": {
            "about": "Sobre Mí",
            "benefits": "Beneficios",
            "process": "Proceso",
            "journey": "Mi Journey",
            "plans": "Planes",
            "joinWaitlist": "Únete al Waitlist"
        },
        "hero": {
            "badge": "Acompañamiento Mental Ecuestre",
            "subtitle": "Entrena tu mente, domina tu camino",
            "description": "Un espacio diseñado para jinetes que aman este deporte, pero sienten que la mente a veces no los deja avanzar como quisieran.",
            "joinButton": "Únete al Waitlist",
            "learnMore": "Conoce Más",
            "founderName": "Nicole Sabogal",
            "founderRole": "Founder Panther Path"
        },
        "stats": {
            "stat1Label": "Personalizado",
            "stat1Desc": "Cada sesión adaptada a ti",
            "stat2Label": "Sesiones",
            "stat2Desc": "Atención individual completa",
            "stat3Label": "Por Sesión",
            "stat3Desc": "Tiempo enfocado en ti",
            "stat4Label": "Beneficios Clave",
            "stat4Desc": "Resultados medibles"
        },
        "nicoleStory": {
            "label": "Mi Historia",
            "title": "Soy Nicole Sabogal",
            "paragraph1": "Monté durante 17 años y durante muchos de ellos fui una persona muy nerviosa para montar. Vivía la equitación con presión, miedo y muchísima tensión interna.",
            "paragraph2": "Aun así, con trabajo, disciplina y el apoyo de mis caballos, llegué a ser campeona nacional con Lasser, y más adelante, con Lolo, logré algo que jamás imaginé:",
            "highlight1": "saltar 1.50 y finalmente disfrutar el deporte.",
            "paragraph3": "Ese proceso —pasar de ser nerviosa a la confianza real— me marcó para siempre. Y es la razón por la que hoy existe",
            "highlight2": "Panther Path"
        },
        "about": {
            "label": "Sobre el Programa",
            "title": "¿Por qué Panther Path?",
            "paragraph1": "Panther Path nace de mi propia experiencia como amazona. Sé lo que es querer disfrutar más, confiar más y montar con claridad… pero sentir que la cabeza juega en contra.",
            "paragraph2": "Por eso creé este proceso: para ayudarte a recuperar tu confianza, disfrutar el deporte nuevamente y avanzar hacia las metas que te ilusionan como jinete.",
            "feature1": "Acompañamiento 100% personalizado",
            "feature2": "Herramientas prácticas y aplicables",
            "feature3": "Resultados medibles y sostenibles"
        },
        "benefits": {
            "label": "Beneficios",
            "title": "En este proceso podrás",
            "benefit1": {
                "title": "Identificar y Superar",
                "description": "Identifica qué te está frenando y cómo superarlo con herramientas prácticas"
            },
            "benefit2": {
                "title": "Reconstruir Confianza",
                "description": "Reconstruye o fortalece tu confianza en la pista"
            },
            "benefit3": {
                "title": "Manejo Emocional",
                "description": "Maneja mejor tus emociones antes, durante y después de entrenar"
            },
            "benefit4": {
                "title": "Presencia y Control",
                "description": "Siéntete más presente, estable y en control"
            },
            "benefit5": {
                "title": "Metas Claras",
                "description": "Traduce tus metas en pasos claros y aplicables durante la montada"
            },
            "benefit6": {
                "title": "Acompañamiento Personalizado",
                "description": "Avanza con un acompañamiento cercano, estructurado y adaptado a tu ritmo"
            }
        },
        "process": {
            "label": "Tu ruta hacia la confianza",
            "title": "Tu camino personalizado",
            "step1": {
                "label": "Inicio",
                "title": "Ciclo de Admisión",
                "description": "Abrimos espacios limitados por temporada para garantizarte una atención exclusiva y personalizada."
            },
            "step2": {
                "label": "Registro",
                "title": "Únete al Waitlist",
                "description": "Asegura tu lugar en la lista de espera prioritaria para ser el primero en enterarte cuando abramos."
            },
            "step3": {
                "label": "Diagnóstico",
                "title": "Sesión Piloto Gratuita",
                "description": "Recibe una sesión inicial de diagnóstico donde trazaremos juntos tu mapa de objetivos y estrategia."
            },
            "step4": {
                "label": "Acción",
                "title": "Confirmación y Despegue",
                "description": "Formalizamos tu ingreso y activamos tu plan de entrenamiento mental. ¡Tu transformación comienza aquí!"
            }
        },
        "gallery": {
            "title": "Vive tu pasión con confianza",
            "cta": "Comienza Ahora"
        },
        "journey": {
            "label": "Mi Historia",
            "title": "Mi Journey con Mis Caballos",
            "legacy": {
                "name": "Legacy",
                "subtitle": "Mi inicio y mi caída",
                "text1": "Legacy fue mi primer caballo.",
                "text2": "Con él crecí, gané muchísimo y me enamoré del deporte… pero también viví un bajón muy fuerte.",
                "text3": "Me comían los nervios, me caía todo el tiempo, me bloqueaba y no lograba salir mentalmente de ese lugar.",
                "text4": "Ahí entendí por primera vez que la equitación se gana o se pierde en la mente."
            },
            "poker": {
                "name": "Poker",
                "subtitle": "El caballo que vino a retar",
                "text1": "Después llegó Poker, quien fue una transición llena de aprendizajes.",
                "text2": "No avanzaba al ritmo que quería y me confundía mucho no entender por qué.",
                "text3": "Fue un camino de crecimiento interno, paciencia y humildad dentro del deporte.",
                "text4": "Poker me enseñó que no todo es lineal, y que sanar mentalmente también hace parte de montar."
            },
            "lasser": {
                "name": "Lasser",
                "subtitle": "Mi cambio mental absoluto",
                "text1": "Con Lasser todo cambió.",
                "text2": "No solo empecé a ganar:",
                "text2b": "fui campeona nacional.",
                "text3": "Él me mostró lo que realmente significa la disciplina, la resiliencia y la importancia de confiar en ti misma.",
                "text4": "Me enseñó que, al final, tú tienes el control de tu mente, de tus decisiones y de tu progreso.",
                "text5": "Lasser fue mi mayor maestro mental."
            },
            "lolo": {
                "name": "Black Panther (Lolo)",
                "subtitle": "El sueño que sí se cumplió",
                "text1": "Black Panther siguió ese legado.",
                "text2": "Durante un tiempo fue el aprendiz de Lasser, un potro lleno de corazón.",
                "text3": "Verlo crecer fue un privilegio: conectar con él me enseñó que los logros más grandes no son siempre en la pista, sino en casa, en los pequeños avances, en la autoestima y en la constancia.",
                "text4": "Desde Legacy yo soñaba con saltar 1.20… y muchos años después, con bloqueos, entrenadores y opiniones que me frenaron, llegó Lolo para demostrarme que",
                "text4b": "cuando la mente cambia, todo cambia.",
                "text5": "Con él cumplí sueños que pensé imposibles: también fuimos campeones nacionales, y antes de fallecer, me regaló el logro más grande de mi vida:",
                "text6": "Saltar 1.50 y entender que no tienes límites cuando confías en tu camino."
            }
        },
        "form": {
            "stepCounter": "de",
            "step1": {
                "title": "¿Cuál es tu nombre?",
                "placeholder": "Escribe tu nombre completo"
            },
            "step2": {
                "title": "¿Cuál es tu email?",
                "placeholder": "tu@email.com"
            },
            "step3": {
                "title": "¿En qué país te encuentras?",
                "placeholder": "Escribe tu país"
            },
            "step4": {
                "title": "¿Cuál es tu número de WhatsApp?",
                "placeholder": "+57 300 123 4567"
            },
            "step5": {
                "title": "¿Cuánto tiempo llevas montando?",
                "option1": "Menos de 1 año",
                "option2": "1-3 años",
                "option3": "3-5 años",
                "option4": "Más de 5 años"
            },
            "step6": {
                "title": "¿Qué disciplina practicas?",
                "option1": "Salto",
                "option2": "Doma",
                "option3": "Completo",
                "option4": "Endurance",
                "option5": "Recreativo",
                "option6": "Otro"
            },
            "step7": {
                "title": "¿Cuál es tu principal reto?",
                "description": "Puedes seleccionar más de uno",
                "option1": "Miedo después de una caída",
                "option2": "Bloqueos mentales",
                "option3": "Falta de confianza",
                "option4": "Ansiedad antes de montar",
                "option5": "Comparación con otros jinetes",
                "option6": "Sensación de estancamiento"
            },
            "step8": {
                "title": "¿Qué te gustaría lograr en los próximos 3-6 meses?",
                "placeholder": "Describe tu objetivo principal..."
            },
            "step9": {
                "title": "¿Qué te motiva a buscar acompañamiento mental en este momento?",
                "placeholder": "Cuéntame qué te llevó a buscar este acompañamiento..."
            },
            "step10": {
                "title": "¿Has hecho antes algún proceso de coaching o acompañamiento mental?",
                "option1": "Sí",
                "option2": "No",
                "option3": "Un poco, pero no de forma constante"
            },
            "step11": {
                "title": "¿Cómo te gustaría que fuera tu proceso ideal?",
                "placeholder": "Describe cómo imaginas tu proceso ideal..."
            },
            "step12": {
                "title": "¿Hay algo adicional que quieras contarme antes de tu sesión?",
                "description": "¿Hay algo que le quieres comentar a Nicole?",
                "placeholder": "Escribe aquí cualquier comentario adicional (opcional)"
            },
            "step13": {
                "title": "Gracias por abrir este espacio conmigo",
                "message": "Ya diste el primer paso para reconectar con tu confianza y sentir nuevamente tranquilidad arriba del caballo. Muy pronto recibirás la confirmación de tu sesión.",
                "checkbox": "Acepto recibir comunicaciones sobre Panther Path"
            },
            "prevBtn": "Anterior",
            "nextBtn": "Siguiente",
            "submitBtn": "Enviar y Agendar Sesión",
            "success": {
                "title": "¡Gracias por tu interés!",
                "message": "Estoy emocionada de acompañarte en tu crecimiento ecuestre. Te contactaremos pronto."
            }
        },
        "plans": {
            "label": "Inversión",
            "title": "Planes Panther Path",
            "description": "Cada sesión es guiada personalmente por mí, de forma 1:1, adaptada a tu nivel, tus retos y tus metas.",
            "plan1": {
                "name": "Sesión Individual",
                "feature1": "1 sesión 1:1 de 45 min",
                "feature2": "Diagnóstico inicial",
                "feature3": "Sin seguimiento posterior",
                "feature4": "Sin grabación de la sesión",
                "feature5": "Ideal para consultas rápidas"
            },
            "plan2": {
                "name": "Paquete de 4 Sesiones",
                "savings": "Ahorras $20 (20% OFF)",
                "feature1": "4 sesiones 1:1 (45 min)",
                "feature2": "Soporte por WhatsApp entre sesiones",
                "feature3": "Grabación de las llamadas",
                "feature4": "Plan de acción PDF"
            },
            "plan3": {
                "name": "Paquete de 6 Sesiones",
                "badge": "Más Popular",
                "savings": "Ahorras $40 (27% OFF)",
                "feature1": "6 sesiones 1:1 (45 min)",
                "feature2": "Soporte por WhatsApp entre sesiones",
                "feature3": "Grabación de las llamadas",
                "feature4": "Plan de acción PDF",
                "feature5": "Material descargable (ejercicios mentales, journaling para jinetes, herramientas de regulación)",
                "feature6": "2 sesiones Check-in de 30 min"
            }
        },
        "waitlist": {
            "label": "Únete",
            "title": "Los cupos actuales ya se encuentran agotados",
            "description": "Si quieres asegurar tu lugar en la próxima apertura, déjame aquí tus datos y serás de los primeros en recibir acceso cuando se abran nuevos espacios.",
            "benefitsTitle": "Beneficios del Waitlist:",
            "benefit1": "Acceso anticipado a los nuevos cupos",
            "benefit2": "Sesión Piloto totalmente gratuita",
            "benefit3": "Prioridad para escoger horarios",
            "benefit4": "Beneficios exclusivos",
            "plansNote": "*Estos beneficios aplican solo para los planes de $80 y $110 USD"
        },
        "footer": {
            "description": "Acompañamiento mental personalizado para jinetes que buscan recuperar su confianza y disfrutar el deporte nuevamente.",
            "navigationTitle": "Navegación",
            "aboutProgram": "Sobre el Programa",
            "benefits": "Beneficios",
            "howItWorks": "Cómo Funciona",
            "plans": "Planes",
            "waitlist": "Waitlist",
            "contactTitle": "Contacto",
            "followTitle": "Síguenos",
            "ctaTitle": "Empieza tu proceso",
            "ctaSubtitle": "Asegura tu lugar en los próximos cupos",
            "ctaButton": "Únete al Waitlist",
            "copyright": "© 2025 Panther Path. Todos los derechos reservados.",
            "privacy": "Política de Privacidad",
            "terms": "Términos y Condiciones"
        },
        "whatsapp": {
            "tooltip": "¿Tienes preguntas? Escríbenos"
        }
    },
    "en": {
        "nav": {
            "about": "About Me",
            "benefits": "Benefits",
            "process": "Process",
            "journey": "My Journey",
            "plans": "Plans",
            "joinWaitlist": "Join Waitlist"
        },
        "hero": {
            "badge": "Equestrian Mental Coaching",
            "subtitle": "Train your mind, master your path",
            "description": "A space designed for riders who love this sport, but feel that their mind sometimes doesn't let them progress as they would like.",
            "joinButton": "Join Waitlist",
            "learnMore": "Learn More",
            "founderName": "Nicole Sabogal",
            "founderRole": "Founder Panther Path"
        },
        "stats": {
            "stat1Label": "Personalized",
            "stat1Desc": "Each session adapted to you",
            "stat2Label": "Sessions",
            "stat2Desc": "Complete individual attention",
            "stat3Label": "Per Session",
            "stat3Desc": "Time focused on you",
            "stat4Label": "Key Benefits",
            "stat4Desc": "Measurable results"
        },
        "nicoleStory": {
            "label": "My Story",
            "title": "I'm Nicole Sabogal",
            "paragraph1": "I rode for 17 years and for many of them I was a very nervous person when riding. I lived equestrian with pressure, fear and a lot of internal tension.",
            "paragraph2": "Even so, with work, discipline and the support of my horses, I became national champion with Lasser, and later, with Lolo, I achieved something I never imagined:",
            "highlight1": "jumping 1.50 and finally enjoying the sport.",
            "paragraph3": "That process —going from being nervous to real confidence— marked me forever. And it's the reason why today exists",
            "highlight2": "Panther Path"
        },
        "about": {
            "label": "About the Program",
            "title": "Why Panther Path?",
            "paragraph1": "Panther Path was born from my own experience as a rider. I know what it's like to want to enjoy more, trust more, and ride with clarity... but feel that your mind is working against you.",
            "paragraph2": "That's why I created this process: to help you regain your confidence, enjoy the sport again, and move toward the goals that excite you as a rider.",
            "feature1": "100% personalized support",
            "feature2": "Practical and applicable tools",
            "feature3": "Measurable and sustainable results"
        },
        "benefits": {
            "label": "Benefits",
            "title": "In this process you will",
            "benefit1": {
                "title": "Identify and Overcome",
                "description": "Identify what's holding you back and how to overcome it with practical tools"
            },
            "benefit2": {
                "title": "Rebuild Confidence",
                "description": "Rebuild or strengthen your confidence on the track"
            },
            "benefit3": {
                "title": "Emotional Management",
                "description": "Better manage your emotions before, during, and after training"
            },
            "benefit4": {
                "title": "Presence and Control",
                "description": "Feel more present, stable, and in control"
            },
            "benefit5": {
                "title": "Clear Goals",
                "description": "Translate your goals into clear and applicable steps during the ride"
            },
            "benefit6": {
                "title": "Personalized Support",
                "description": "Progress with close, structured support adapted to your pace"
            }
        },
        "process": {
            "label": "Your path to confidence",
            "title": "Your personalized journey",
            "step1": {
                "label": "Start",
                "title": "Admission Cycle",
                "description": "We open limited spaces per season to guarantee you exclusive and personalized attention."
            },
            "step2": {
                "label": "Registration",
                "title": "Join the Waitlist",
                "description": "Secure your place on the priority waiting list to be the first to know when we open."
            },
            "step3": {
                "label": "Diagnosis",
                "title": "Free Pilot Session",
                "description": "Receive an initial diagnostic session where we'll map out your goals and strategy together."
            },
            "step4": {
                "label": "Action",
                "title": "Confirmation and Takeoff",
                "description": "We formalize your enrollment and activate your mental training plan. Your transformation begins here!"
            }
        },
        "gallery": {
            "title": "Live your passion with confidence",
            "cta": "Start Now"
        },
        "journey": {
            "label": "My Story",
            "title": "My Journey with My Horses",
            "legacy": {
                "name": "Legacy",
                "subtitle": "My beginning and my fall",
                "text1": "Legacy was my first horse.",
                "text2": "With him I grew, won a lot and fell in love with the sport... but also experienced a very strong low.",
                "text3": "Nerves consumed me, I fell all the time, I blocked myself and couldn't mentally escape that place.",
                "text4": "There I understood for the first time that equestrian is won or lost in the mind."
            },
            "poker": {
                "name": "Poker",
                "subtitle": "The horse that came to challenge",
                "text1": "Then came Poker, who was a transition full of learnings.",
                "text2": "I wasn't progressing at the pace I wanted and it confused me a lot not understanding why.",
                "text3": "It was a path of internal growth, patience and humility within the sport.",
                "text4": "Poker taught me that not everything is linear, and that healing mentally is also part of riding."
            },
            "lasser": {
                "name": "Lasser",
                "subtitle": "My absolute mental change",
                "text1": "With Lasser everything changed.",
                "text2": "Not only did I start winning:",
                "text2b": "I became national champion.",
                "text3": "He showed me what discipline, resilience and the importance of trusting yourself really means.",
                "text4": "He taught me that, in the end, you have control of your mind, your decisions and your progress.",
                "text5": "Lasser was my greatest mental teacher."
            },
            "lolo": {
                "name": "Black Panther (Lolo)",
                "subtitle": "The dream that did come true",
                "text1": "Black Panther continued that legacy.",
                "text2": "For a while he was Lasser's apprentice, a colt full of heart.",
                "text3": "Watching him grow was a privilege: connecting with him taught me that the greatest achievements aren't always on the track, but at home, in the small advances, in self-esteem and consistency.",
                "text4": "Since Legacy I dreamed of jumping 1.20... and many years later, with blocks, trainers and opinions that held me back, Lolo came to show me that",
                "text4b": "when the mind changes, everything changes.",
                "text5": "With him I fulfilled dreams I thought impossible: we were also national champions, and before passing away, he gave me the greatest achievement of my life:",
                "text6": "Jumping 1.50 and understanding that you have no limits when you trust your path."
            }
        },
        "form": {
            "stepCounter": "of",
            "step1": {
                "title": "What is your name?",
                "placeholder": "Write your full name"
            },
            "step2": {
                "title": "What is your email?",
                "placeholder": "you@email.com"
            },
            "step3": {
                "title": "What country are you in?",
                "placeholder": "Write your country"
            },
            "step4": {
                "title": "What is your WhatsApp number?",
                "placeholder": "+1 555 123 4567"
            },
            "step5": {
                "title": "How long have you been riding?",
                "option1": "Less than 1 year",
                "option2": "1-3 years",
                "option3": "3-5 years",
                "option4": "More than 5 years"
            },
            "step6": {
                "title": "What discipline do you practice?",
                "option1": "Show Jumping",
                "option2": "Dressage",
                "option3": "Eventing",
                "option4": "Endurance",
                "option5": "Recreational",
                "option6": "Other"
            },
            "step7": {
                "title": "What is your main challenge?",
                "description": "You can select more than one",
                "option1": "Fear after a fall",
                "option2": "Mental blocks",
                "option3": "Lack of confidence",
                "option4": "Anxiety before riding",
                "option5": "Comparison with other riders",
                "option6": "Feeling stuck"
            },
            "step8": {
                "title": "What would you like to achieve in the next 3-6 months?",
                "placeholder": "Describe your main goal..."
            },
            "step9": {
                "title": "What motivates you to seek mental coaching right now?",
                "placeholder": "Tell me what led you to seek this support..."
            },
            "step10": {
                "title": "Have you done any coaching or mental support process before?",
                "option1": "Yes",
                "option2": "No",
                "option3": "A little, but not consistently"
            },
            "step11": {
                "title": "How would you like your ideal process to be?",
                "placeholder": "Describe how you imagine your ideal process..."
            },
            "step12": {
                "title": "Is there anything else you'd like to tell me before your session?",
                "description": "Is there anything you want to share with Nicole?",
                "placeholder": "Write any additional comments here (optional)"
            },
            "step13": {
                "title": "Thank you for opening this space with me",
                "message": "You've taken the first step to reconnect with your confidence and feel calm on horseback again. You'll receive your session confirmation very soon.",
                "checkbox": "I agree to receive communications about Panther Path"
            },
            "prevBtn": "Previous",
            "nextBtn": "Next",
            "submitBtn": "Submit and Schedule Session",
            "success": {
                "title": "Thank you for your interest!",
                "message": "I'm excited to support you in your equestrian growth. We'll contact you soon."
            }
        },
        "plans": {
            "label": "Investment",
            "title": "Panther Path Plans",
            "description": "Each session is personally guided by me, 1:1, adapted to your level, your challenges, and your goals.",
            "plan1": {
                "name": "Individual Session",
                "feature1": "1 session 1:1 of 45 min",
                "feature2": "Initial diagnosis",
                "feature3": "No subsequent follow-up",
                "feature4": "No session recording",
                "feature5": "Ideal for quick consultations"
            },
            "plan2": {
                "name": "4-Session Package",
                "savings": "Save $20 (20% OFF)",
                "feature1": "4 sessions 1:1 (45 min)",
                "feature2": "WhatsApp support between sessions",
                "feature3": "Call recordings",
                "feature4": "PDF action plan"
            },
            "plan3": {
                "name": "6-Session Package",
                "badge": "Most Popular",
                "savings": "Save $40 (27% OFF)",
                "feature1": "6 sessions 1:1 (45 min)",
                "feature2": "WhatsApp support between sessions",
                "feature3": "Call recordings",
                "feature4": "PDF action plan",
                "feature5": "Downloadable material (mental exercises, journaling for riders, regulation tools)",
                "feature6": "2 Check-in sessions of 30 min"
            }
        },
        "waitlist": {
            "label": "Join",
            "title": "Current spots are sold out",
            "description": "If you want to secure your place for the next opening, leave your details here and you'll be among the first to receive access when new spaces open.",
            "benefitsTitle": "Waitlist Benefits:",
            "benefit1": "Early access to new spots",
            "benefit2": "Completely free Pilot Session",
            "benefit3": "Priority to choose schedules",
            "benefit4": "Exclusive benefits",
            "plansNote": "*These benefits apply only to the $80 and $110 USD plans"
        },
        "footer": {
            "description": "Personalized mental support for equestrian riders seeking to regain their confidence and enjoy the sport again.",
            "navigationTitle": "Navigation",
            "aboutProgram": "About the Program",
            "benefits": "Benefits",
            "howItWorks": "How It Works",
            "plans": "Plans",
            "waitlist": "Waitlist",
            "contactTitle": "Contact",
            "followTitle": "Follow Us",
            "ctaTitle": "Start your process",
            "ctaSubtitle": "Secure your spot in the next openings",
            "ctaButton": "Join Waitlist",
            "copyright": "© 2025 Panther Path. All rights reserved.",
            "privacy": "Privacy Policy",
            "terms": "Terms and Conditions"
        },
        "whatsapp": {
            "tooltip": "Questions? Write us"
        }
    }
};

// ===========================
// MOBILE ACCORDION FUNCTIONALITY
// ===========================

function toggleAccordion(button) {
    const content = button.nextElementSibling;
    const isActive = button.classList.contains('active');

    // Close all accordions in the same container
    const container = button.closest('.mobile-accordion-container');
    if (container) {
        container.querySelectorAll('.mobile-accordion-toggle').forEach(toggle => {
            toggle.classList.remove('active');
        });
        container.querySelectorAll('.mobile-accordion-content').forEach(content => {
            content.classList.remove('active');
        });
    }

    // Toggle current accordion (if it wasn't active, open it)
    if (!isActive) {
        button.classList.add('active');
        content.classList.add('active');
    }
}

// Initialize language toggle and apply translations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initLanguageToggle();
    updateLanguage(currentLang);
});

// Initialize language toggle buttons
function initLanguageToggle() {
    const langButtons = document.querySelectorAll('.lang-btn');

    // Set initial active state
    langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Add click handlers
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            if (lang !== currentLang) {
                currentLang = lang;
                localStorage.setItem('language', lang);
                updateLanguage(lang);

                // Update active state
                langButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    });
}

// Update page language
function updateLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    // Helper function to get nested translation value
    function getTranslation(keys, translations) {
        let value = translations;
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                return null;
            }
        }
        return value;
    }

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        const value = getTranslation(keys, t);

        if (value) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
            } else {
                element.textContent = value;
            }
        }
    });

    // Update all elements with data-i18n-placeholder (for inputs/textareas)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const keys = key.split('.');
        const value = getTranslation(keys, t);

        if (value) {
            element.placeholder = value;
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;


}


// ===========================
// NAVIGATION
// ===========================

const navbar = document.getElementById('navbar');
let lastScroll = 0;
let scrollTicking = false;

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset;

            if (currentScroll <= 0) {
                navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
            } else {
                navbar.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.6)';
            }

            lastScroll = currentScroll;
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}, { passive: true });

// ===========================
// VIDEO MODAL
// ===========================

const videoModal = document.getElementById('videoModal');
const videoIframe = document.getElementById('videoIframe');
const videoPlayBtn = document.querySelector('.video-play-btn');
const videoModalClose = document.querySelector('.video-modal-close');
const videoModalOverlay = document.querySelector('.video-modal-overlay');

// Open video modal
if (videoPlayBtn) {
    videoPlayBtn.addEventListener('click', () => {
        const videoId = videoPlayBtn.getAttribute('data-video');
        const videoUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;

        videoIframe.src = videoUrl;
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
}

// Close video modal
function closeVideoModal() {
    videoModal.classList.remove('active');
    videoIframe.src = ''; // Stop video playback
    document.body.style.overflow = ''; // Restore scrolling
}

if (videoModalClose) {
    videoModalClose.addEventListener('click', closeVideoModal);
}

if (videoModalOverlay) {
    videoModalOverlay.addEventListener('click', closeVideoModal);
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeVideoModal();
    }
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// ===========================
// HERO SLIDER
// ===========================

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;
let slideInterval;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function startSlideShow() {
    slideInterval = setInterval(nextSlide, 6000); // Change slide every 6 seconds
}

function stopSlideShow() {
    clearInterval(slideInterval);
}

// Slider controls
const sliderPrevBtn = document.getElementById('sliderPrev');
const sliderNextBtn = document.getElementById('sliderNext');

if (sliderPrevBtn && sliderNextBtn) {
    sliderPrevBtn.addEventListener('click', () => {
        prevSlide();
        stopSlideShow();
        startSlideShow();
    });

    sliderNextBtn.addEventListener('click', () => {
        nextSlide();
        stopSlideShow();
        startSlideShow();
    });
}

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        stopSlideShow();
        startSlideShow();
    });
});

// Start auto-play
startSlideShow();

// Pause on hover
const heroSlider = document.querySelector('.hero-slider');
if (heroSlider) {
    heroSlider.addEventListener('mouseenter', stopSlideShow);
    heroSlider.addEventListener('mouseleave', startSlideShow);
}

// ===========================
// STATS COUNTER ANIMATION
// ===========================

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number, .stat-number-enhanced');
            statNumbers.forEach(num => {
                if (!num.classList.contains('animated')) {
                    animateCounter(num);
                    num.classList.add('animated');
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===========================
// ROUTE ANIMATION (SCROLL TRIGGER)
// ===========================

const routeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const steps = entry.target.querySelectorAll('.route-step');
            steps.forEach((step, index) => {
                setTimeout(() => {
                    step.classList.add('visible');
                }, index * 400); // 400ms delay between each step
            });
            routeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

const routeContainer = document.querySelector('.route-container');
if (routeContainer) {
    routeObserver.observe(routeContainer);
}

// ===========================
// MULTI-STEP FORM (13 STEPS)
// ===========================

let currentStep = 1;
const totalSteps = 13;
const formData = {};

const waitlistForm = document.getElementById('waitlistForm');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const progressFill = document.getElementById('progressFill');
const currentStepNum = document.getElementById('currentStepNum');

// Initialize form
function initForm() {
    showStep(currentStep);
    updateButtons();
    updateProgress();
}

// Show specific step
function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step-content').forEach(content => {
        content.classList.remove('active');
    });

    // Show current step
    const currentContent = document.querySelector(`.form-step-content[data-step="${step}"]`);
    if (currentContent) {
        currentContent.classList.add('active');
    }

    // Update step counter
    if (currentStepNum) {
        currentStepNum.textContent = step;
    }
}

// Update progress bar
function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
}

// Update button visibility
function updateButtons() {
    prevBtn.style.display = currentStep === 1 ? 'none' : 'flex';
    nextBtn.style.display = currentStep === totalSteps ? 'none' : 'flex';
    submitBtn.style.display = currentStep === totalSteps ? 'block' : 'none';
}

// Validate current step
function validateStep(step) {
    const currentContent = document.querySelector(`.form-step-content[data-step="${step}"]`);
    const inputs = currentContent.querySelectorAll('input[required], select[required], textarea[required]');

    let isValid = true;

    inputs.forEach(input => {
        if (input.type === 'radio') {
            const radioGroup = currentContent.querySelectorAll(`input[name="${input.name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            if (!isChecked) {
                isValid = false;
                showError(input.name, 'Por favor selecciona una opción');
            }
        } else if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                showError(input.id, 'Por favor ingresa un email válido');
            }
        } else if (!input.value.trim()) {
            isValid = false;
            showError(input.id, 'Este campo es requerido');
        }
    });

    return isValid;
}

// Save step data
function saveStepData(step) {
    const currentContent = document.querySelector(`.form-step-content[data-step="${step}"]`);
    const inputs = currentContent.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            if (!formData[input.name]) {
                formData[input.name] = [];
            }
            if (input.checked && !formData[input.name].includes(input.value)) {
                formData[input.name].push(input.value);
            }
        } else if (input.type === 'radio') {
            if (input.checked) {
                formData[input.name] = input.value;
            }
        } else {
            formData[input.name] = input.value;
        }
    });
}

// Update form summary
function updateFormSummary() {
    const summaryDiv = document.getElementById('formSummary');

    const retosLabels = {
        'miedo-caidas': 'Miedo después de una caída',
        'bloqueos-mentales': 'Bloqueos mentales',
        'falta-confianza': 'Falta de confianza',
        'ansiedad': 'Ansiedad antes de montar',
        'comparacion': 'Comparación con otros jinetes',
        'estancamiento': 'Sensación de estancamiento'
    };

    const experienciaLabels = {
        'menos-1-ano': 'Menos de 1 año',
        '1-3-anos': '1-3 años',
        '3-5-anos': '3-5 años',
        'mas-5-anos': 'Más de 5 años'
    };

    let retos = '';
    if (formData.retos && formData.retos.length > 0) {
        retos = formData.retos.map(r => retosLabels[r] || r).join(', ');
    }

    summaryDiv.innerHTML = `
        <div style="background: var(--color-surface-light); padding: var(--spacing-lg); border-radius: var(--radius-md); margin-bottom: var(--spacing-lg); border: 1px solid var(--color-border);">
            <h4 style="color: var(--color-secondary); margin-bottom: var(--spacing-md);">Resumen de tu información</h4>
            
            <div style="display: grid; gap: var(--spacing-sm);">
                <div>
                    <strong style="color: var(--color-text-primary);">Nombre:</strong>
                    <span style="color: var(--color-text-secondary);"> ${formData.nombre || 'N/A'}</span>
                </div>
                <div>
                    <strong style="color: var(--color-text-primary);">Email:</strong>
                    <span style="color: var(--color-text-secondary);"> ${formData.email || 'N/A'}</span>
                </div>
                <div>
                    <strong style="color: var(--color-text-primary);">País:</strong>
                    <span style="color: var(--color-text-secondary);"> ${formData.pais || 'N/A'}</span>
                </div>
                ${formData.telefono ? `
                <div>
                    <strong style="color: var(--color-text-primary);">Teléfono:</strong>
                    <span style="color: var(--color-text-secondary);"> ${formData.telefono}</span>
                </div>
                ` : ''}
                <div>
                    <strong style="color: var(--color-text-primary);">Experiencia:</strong>
                    <span style="color: var(--color-text-secondary);"> ${experienciaLabels[formData.experiencia] || 'N/A'}</span>
                </div>
                <div>
                    <strong style="color: var(--color-text-primary);">Disciplina:</strong>
                    <span style="color: var(--color-text-secondary);"> ${formData.disciplina || 'N/A'}</span>
                </div>
                ${retos ? `
                <div>
                    <strong style="color: var(--color-text-primary);">Retos:</strong>
                    <span style="color: var(--color-text-secondary);"> ${retos}</span>
                </div>
                ` : ''}
                ${formData.objetivo ? `
                <div>
                    <strong style="color: var(--color-text-primary);">Objetivo:</strong>
                    <p style="color: var(--color-text-secondary); margin-top: 0.5rem;">${formData.objetivo}</p>
                </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Show error message
function showError(fieldId, message) {
    const field = document.getElementById(fieldId) || document.querySelector(`[name="${fieldId}"]`);
    if (!field) return;

    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    field.style.borderColor = 'var(--color-error)';

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = 'var(--color-error)';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);

    field.addEventListener('input', () => {
        field.style.borderColor = '';
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, { once: true });
}

// Next button click
nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
        saveStepData(currentStep);
        currentStep++;
        showStep(currentStep);
        updateButtons();
        updateProgress();
    }
});

// Handle Enter key to go to next step
waitlistForm.addEventListener('keydown', (e) => {
    // If Enter is pressed and it's not on a textarea
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault(); // Prevent form submission

        // If we're not on the last step, go to next step
        if (currentStep < totalSteps) {
            if (validateStep(currentStep)) {
                saveStepData(currentStep);
                currentStep++;
                showStep(currentStep);
                updateButtons();
                updateProgress();

                // Focus on the first input of the new step
                setTimeout(() => {
                    const currentContent = document.querySelector(`.form-step-content[data-step="${currentStep}"]`);
                    const firstInput = currentContent.querySelector('input, select, textarea');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 100);
            }
        }
    }
});

// Previous button click
prevBtn.addEventListener('click', () => {
    saveStepData(currentStep);
    currentStep--;
    showStep(currentStep);
    updateButtons();
    updateProgress();
});

// Form submission
waitlistForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
        return;
    }

    saveStepData(currentStep);

    const submitButton = submitBtn;
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    try {
        await submitToWaitlist(formData);

        waitlistForm.style.display = 'none';
        successMessage.classList.add('show');
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        waitlistForm.reset();
        currentStep = 1;

    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Hubo un error al enviar el formulario. Por favor, intenta nuevamente.');
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
});

// Submit to waitlist (CRM Backend Integration with backup)
async function submitToWaitlist(data) {
    // Always save to localStorage as backup FIRST (never lose data)
    saveToLocalStorageBackup(data);

    // Use full URL to ensure it works
    const CRM_API_URL = 'https://pantherpath.co/crm/api/contacts';

    try {
        const response = await fetch(CRM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
            console.log('✅ Contacto guardado en CRM');
            return { success: true };
        } else {
            console.error('❌ Respuesta del CRM sin éxito', result);
            // Still return success because we have the backup
            return { success: true, backup: true };
        }
    } catch (error) {
        console.error('❌ Error al enviar al CRM:', error);
        // The data is already saved in localStorage backup
        console.log('💾 Contacto guardado en respaldo local');
        return { success: true, backup: true };
    }
}

// Backup function - ALWAYS save locally to never lose data
function saveToLocalStorageBackup(data) {
    try {
        const backupList = JSON.parse(localStorage.getItem('pantherPathBackup') || '[]');
        backupList.push({
            ...data,
            timestamp: new Date().toISOString(),
            synced: false
        });
        localStorage.setItem('pantherPathBackup', JSON.stringify(backupList));
        console.log('💾 Respaldo guardado localmente');
    } catch (e) {
        console.error('Error guardando respaldo:', e);
    }
}

// Función auxiliar para guardar en localStorage
function saveToLocalStorage(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const waitlist = JSON.parse(localStorage.getItem('pantherPathWaitlist') || '[]');
            waitlist.push({
                ...data,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('pantherPathWaitlist', JSON.stringify(waitlist));

            resolve({ success: true });
        }, 500);
    });
}

// Radio and checkbox option styling
document.querySelectorAll('.radio-option input, .checkbox-option input, .radio-option-large input, .checkbox-option-large input').forEach(input => {
    input.addEventListener('change', () => {
        const option = input.closest('.radio-option, .checkbox-option, .radio-option-large, .checkbox-option-large');

        if (input.type === 'radio') {
            const name = input.name;
            document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
                const parentOption = radio.closest('.radio-option, .radio-option-large');
                if (parentOption) {
                    parentOption.classList.remove('selected');
                }
            });
        }

        if (input.checked) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
});

// Initialize form on page load
document.addEventListener('DOMContentLoaded', () => {
    initForm();
});

// ===========================
// INTERSECTION OBSERVER
// ===========================

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

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.beneficio-card, .plan-card, .proceso-step, .sobre-content'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===========================
// PARALLAX EFFECT
// ===========================

const heroElement = document.querySelector('.hero');
let parallaxTicking = false;

if (heroElement) {
    window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                heroElement.style.backgroundPositionY = `${scrolled * 0.5}px`;
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    }, { passive: true });
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedScroll = debounce(() => {
    // Additional scroll-based functionality
}, 100);

window.addEventListener('scroll', debouncedScroll);

// ===========================
// ACCESSIBILITY ENHANCEMENTS
// ===========================

document.querySelectorAll('.beneficio-card, .plan-card').forEach(card => {
    card.setAttribute('tabindex', '0');

    card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            card.click();
        }
    });
});

function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
`;
document.head.appendChild(style);


