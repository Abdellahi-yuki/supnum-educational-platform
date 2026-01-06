import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Mail,
    Users,
    Archive,
    FileText,
    ArrowRight,
    ShieldCheck,
    Globe,
    CheckCircle2
} from 'lucide-react';
import './Landing.css';
import heroArt from '../../assets/images/landing-hero.png';

const Landing = () => {
    const navigate = useNavigate();
    const scrollRevealRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        scrollRevealRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const addToRefs = (el) => {
        if (el && !scrollRevealRefs.current.includes(el)) {
            scrollRevealRefs.current.push(el);
        }
    };

    const coreFeatures = [
        {
            icon: <Mail className="icon-blue" />,
            title: "Messagerie Sécurisée",
            desc: "Un environnement d'échange chiffré et professionnel pour la communication académique."
        },
        {
            icon: <Users className="icon-green" />,
            title: "Plateforme Collaborative",
            desc: "Espaces de discussion dédiés favorisant l'entraide et le partage de connaissances."
        },
        {
            icon: <Archive className="icon-blue" />,
            title: "Ressources Numériques",
            desc: "Accès centralisé à l'ensemble du patrimoine pédagogique de l'établissement."
        },
        {
            icon: <FileText className="icon-green" />,
            title: "Suivi Académique",
            desc: "Visualisation transparente de votre parcours, de vos notes et de votre progression."
        }
    ];

    return (
        <div className="landing-premium">
            {/* Logo-First Navigation */}
            <nav className="p-nav glass-2-0">
                <div className="p-nav-wrapper">
                    <div className="p-logo">
                        <img src="/assets/logo-supnum.png" alt="SupNum Logo" className="header-logo" />
                        <span className="logo-text">SupNum</span>
                    </div>
                    <div className="p-nav-links">
                        <button className="p-nav-btn secondary" onClick={() => navigate('/login')}>Connexion</button>
                        <button className="p-nav-btn primary" onClick={() => navigate('/register')}>S'inscrire</button>
                    </div>
                </div>
            </nav>

            {/* Institutional Hero */}
            <header className="p-hero">
                <div className="hero-artwork-container">
                    <img src={heroArt} alt="Visual Excellence" className="hero-artwork" />
                </div>
                <div className="hero-text-overlay" ref={addToRefs}>
                    <div className="h-badge glass-2-0">Plateforme Officielle - SupNum</div>
                    <h1 className="h-title">
                        L'Excellence Académique par <br />
                        <span className="highlight">l'Innovation Numérique.</span>
                    </h1>
                    <p className="h-lead">
                        Bienvenue sur l'Espace Numérique de Travail de SupNum. <br />
                        Une infrastructure robuste dédiée à la réussite de nos étudiants.
                    </p>
                    <div className="h-actions">
                        <button className="p-btn-glow" onClick={() => navigate('/login')}>
                            Accéder à mon espace <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Institutional Values */}
            <section className="p-values section-padding">
                <div className="v-header" ref={addToRefs}>
                    <h2 className="v-title">L'Innovation au Service du Savoir</h2>
                    <p className="v-subtitle">Un écosystème numérique robuste et intuitif.</p>
                </div>
                <div className="v-grid">
                    <div className="v-card glass-2-0" ref={addToRefs}>
                        <ShieldCheck className="v-icon blue" />
                        <h3>Environnement de Confiance</h3>
                        <p>Une sécurisation avancée de vos données et de vos communications institutionnelles.</p>
                    </div>
                    <div className="v-card glass-2-0" ref={addToRefs}>
                        <Globe className="v-icon green" />
                        <h3>Disponibilité Totale</h3>
                        <p>Accédez à vos ressources et à votre communauté partout, tout le temps, en un clic.</p>
                    </div>
                    <div className="v-card glass-2-0" ref={addToRefs}>
                        <CheckCircle2 className="v-icon blue" />
                        <h3>Interface Optimisée</h3>
                        <p>Une ergonomie pensée pour minimiser les distractions et maximiser la concentration.</p>
                    </div>
                </div>
            </section>

            {/* Modules Grid */}
            <section className="p-modules section-padding bg-darker">
                <div className="m-header" ref={addToRefs}>
                    <h2 className="m-title">Services Intégrés</h2>
                </div>
                <div className="m-grid">
                    {coreFeatures.map((f, idx) => (
                        <div key={idx} className="m-item glass-2-0" ref={addToRefs}>
                            <div className="m-icon-box">{f.icon}</div>
                            <div className="m-content">
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="p-cta section-padding" ref={addToRefs}>
                <div className="cta-glass-box glass-2-0">
                    <h2>Rejoignez l'Écosystème Numérique</h2>
                    <p>Connectez-vous dès maintenant pour accéder à vos services et ressources.</p>
                    <div className="cta-btns">
                        <button className="p-btn-glow" onClick={() => navigate('/login')}>Se connecter à SupNum</button>
                        <button className="p-btn-ghost" onClick={() => navigate('/register')}>Nouvelle inscription</button>
                    </div>
                </div>
            </section>

            <footer className="p-footer">
                <div className="f-logo">
                    <img src="/assets/logo-supnum.png" alt="SupNum" className="footer-logo" />
                </div>
                <p>&copy; 2026 SupNum - École Supérieure du Numérique. Dédié à la formation des leaders de demain.</p>
            </footer>
        </div>
    );
};

export default Landing;
