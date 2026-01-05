        export const database = {
            semestres: [
                {id: 1, nom: "Semestre 1 - L1"},
                {id: 2, nom: "Semestre 2 - L1"},
                {id: 3, nom: "Semestre 3 - L2"},
                {id: 4, nom: "Semestre 4 - L2"},
                {id: 5, nom: "Semestre 5 - L3"},
                {id: 6, nom: "Semestre 6 - L3"}
            ],
            
            matieres: [
                // Matières du semestre 1
                //module lou9ate
                {id: 1, nom: "Anglais Ⅰ", id_semestre: 1},
                {id: 2, nom: "Communication Ⅰ", id_semestre: 1},
                {id: 3, nom: "PPP", id_semestre: 1},
                //module maths
                {id: 4, nom: "Analyse", id_semestre: 1},
                {id: 5, nom: "Algebre Ⅰ", id_semestre: 1},
                {id: 6, nom: "PIX Ⅰ", id_semestre: 1},
                //module programmation
                {id: 7, nom: "Algorithmique et Programmation", id_semestre: 1},
                {id: 8, nom: "Téchnologie Web", id_semestre: 1},
                {id: 9, nom: "Bases de données", id_semestre: 1},
                //module informatique
                {id: 10, nom: "Bases Informatique", id_semestre: 1},
                {id: 11, nom: "Concepts de base de réseaux", id_semestre: 1},

                // Matières du semestre 2
                //module lou9ate
                {id: 12, nom: "Anglais Ⅱ", id_semestre: 2},
                {id: 13, nom: "Communication Ⅱ", id_semestre: 2},
                {id: 14, nom: "PPP", id_semestre: 2},
                //module maths
                {id: 15, nom: "Probabilite & Statistique", id_semestre: 2},
                {id: 16, nom: "Algebre Ⅱ", id_semestre: 2},
                {id: 17, nom: "Préparation du certificat PIX ", id_semestre: 2},
                //module programmation
                {id: 18, nom: "Programmation python", id_semestre: 2},
                {id: 19, nom: "Language Web", id_semestre: 2},
                //module les systèmes
                {id: 20, nom: "Systèmes d'exploitation", id_semestre: 2},
                {id: 21, nom: "Systèmes logique", id_semestre: 2},
                //module specialité
                {id: 22, nom: "Service réseaux (RSS)", id_semestre: 2},
                {id: 23, nom: "SGBD Avanceé (DSI)", id_semestre: 2},
                {id: 24, nom: "CMS et PAO Ⅰ (DWM)", id_semestre: 2},
                {id: 25, nom: "Projet integrateur PI", id_semestre: 2},

                // Matières du semestre 3
               
                //module lou9ate
                {id: 26, nom: "Anglais Ⅲ", id_semestre: 3},
                {id: 27, nom: "Communication Ⅲ", id_semestre: 3},
                {id: 28, nom: "PPP", id_semestre: 3},
                {id: 29, nom: "Gestion d'entreprise", id_semestre: 3},

                //module sciences des données
                {id: 30, nom: "machine learning", id_semestre: 3},
                {id: 31, nom: "Recherche opérationnelle", id_semestre: 3},
                
                //module programmation avancée
                {id: 32, nom: "Programmation Orientée Objet JAVA", id_semestre: 3},
                {id: 33, nom: "Structure de donneés et Complexité algo", id_semestre: 3},
                {id: 34, nom: "Projet integrateur Avancée Ⅰ", id_semestre: 3},
                
                //module specialité RSS
                {id: 35, nom: "Introduction aux Réseaux Mobile (RSS)", id_semestre: 3},
                {id: 36, nom: "Administration systémes et réseaux (RSS)", id_semestre: 3},
                {id: 37, nom: "Introduction á la Sécurité info (RSS)", id_semestre: 3},
                {id: 38, nom: "Bases de données et conception des SI (RSS)", id_semestre: 3},
                //module specialité DSI
                {id: 39, nom: "Genie logiciel (DSI)", id_semestre: 3},
                {id: 40, nom: "Bases de données avanceé(oracle) (DSI)", id_semestre: 3},
                {id: 41, nom: "Developpement Web avec python (DSI)", id_semestre: 3},
                {id: 42, nom: "DevOps (DSI)", id_semestre: 3},
                //module specialité DWM
                {id: 43, nom: "CMS et PAO Ⅱ (DWM)", id_semestre: 3},
                {id: 44, nom: "Numérisation et codage des objets Multimédia (DWM)", id_semestre: 3},
                {id: 45, nom: "Téchnologie Multimédia avanceé (DWM)", id_semestre: 3},
                {id: 46, nom: "Bases de données et conception des SI (DWM)", id_semestre: 3},
                
                // Matières du semestre 4
                //module lou9ate
                {id: 47, nom: "Anglais Ⅳ", id_semestre: 4},
                {id: 48, nom: "Communication Ⅳ", id_semestre: 4},
                {id: 49, nom: "Droit d'info", id_semestre: 4},
                //module sciences des données
                {id: 50, nom: "Intelligence Artificielle (IA)", id_semestre: 4},
                {id: 51, nom: "Dev Mobile", id_semestre: 4},
                {id: 52, nom: "JEE", id_semestre: 4},
                //stage s4
                {id: 53, nom: "Stage S4", id_semestre: 4},
                {id: 54, nom: "Projet integrateur ", id_semestre: 4},
                //module spécialité RSS
                {id: 55, nom: "Réseaux et Sécurité avanceé (RSS)", id_semestre: 4},
                {id: 56, nom: "Voix ToIP(RSS)", id_semestre: 4},
                //module spécialité DSI
                {id: 57, nom: "MongoDB (DSI)", id_semestre: 4},
                {id: 58, nom: "Réseaux Sécurité (DSI)", id_semestre: 4},
                //module spécialité DWM
                {id: 59, nom: "infographie,animation 2D/3D (DWM)", id_semestre: 4},
                {id: 60, nom: "Réseaux et Sécurité avanceé (DWM)", id_semestre: 4},

                // Matières du semestre 5
                //module lou9ate
                {id: 61, nom: "Anglais Ⅴ", id_semestre: 5},
                {id: 62, nom: "Communication Ⅴ", id_semestre: 5},
                {id: 63, nom: "Entreprenariat", id_semestre: 5},
                //module 1
                {id: 64, nom: "Big Data", id_semestre: 5},
                {id: 65, nom: "Virtualisation et cloud", id_semestre: 5},
                {id: 66, nom: "Archi SOA et Web services", id_semestre: 5},
                //module 2
                {id: 67, nom: "J2E avancé", id_semestre: 5},
                {id: 68, nom: "Projet fin cursus ", id_semestre: 5},
                {id: 69, nom: "Gestion de projets agiles", id_semestre: 5},
                //module spécialité RSS
                {id: 70, nom: "Prep.Certif CCNA (RSS)", id_semestre: 5},
                {id: 71, nom: "Prep.Certif Reseaux fixes (RSS)", id_semestre: 5},
                //module spécialité DSI
                {id: 72, nom: "Prep.Certif Oracle (DSI)", id_semestre: 5},
                {id: 73, nom: "Prep.Certif Python (DSI)", id_semestre: 5},
                //module spécialité DWM
                {id: 74, nom: "Prep.Certif Ux Design (DWM)", id_semestre: 5},
                {id: 75, nom: "Indexation ,Recherche info (DWM)", id_semestre: 5},

                // Matières du semestre 6
                //module stage
                {id: 76, nom: "Stage S6", id_semestre: 6}

            ],
            
            supports: [
                // Exemples de supports pour Anglais I - Fichiers locaux
                {id: 1, nom: "Student book", type: "cours", chemin_fichier: "./s1/anglais/Elem 4th SB.pdf", id_matiere: 1},
                {id: 2, nom: "Workbook", type: "td", chemin_fichier: "./s1/anglais/Workbook.pdf", id_matiere: 1},
                //Analyse
                //cours
                {id: 3, nom: "Suites réelles et séries numériques", type: "cours", chemin_fichier: "./s1/Analyse/cours/Suites réelles et séries numériques.pdf", id_matiere: 4},
                {id: 4, nom: "Fonctions réelles", type: "cours", chemin_fichier: "./s1/Analyse/cours/Fonctions réelles.pdf", id_matiere: 4},
                {id: 5, nom: "Dérivées et applications", type: "cours", chemin_fichier: "./s1/Analyse/cours/Dérivées et applications.pdf", id_matiere: 4},
                //TD
                {id: 6, nom: "TD_01", type: "td", chemin_fichier: "./s1/Analyse/TD/TD1-Analyse.pdf", id_matiere: 4},
                {id: 7, nom: "TD_02", type: "td", chemin_fichier: "./s1/Analyse/TD/TD2-Analyse.pdf", id_matiere: 4},
                {id: 8, nom: "TD_03", type: "td", chemin_fichier: "./s1/Analyse/TD/TD3-Analyse.pdf", id_matiere: 4},
                //devoir
                {id: 9, nom: "2022-2023", type: "devoir", chemin_fichier: "./s1/Analyse/devoir/CC -22.pdf", id_matiere: 4},
                {id: 10, nom: "2023-2024", type: "devoir", chemin_fichier: "./s1/Analyse/devoir/CC-23.pdf", id_matiere: 4},
                {id: 11, nom: "2024-2025", type: "devoir", chemin_fichier: "./s1/Analyse/devoir/CC-24.pdf", id_matiere: 4},
                //examen
                {id: 12, nom: "2022-2023", type: "examen", chemin_fichier: "./s1/Analyse/exam/SN-22.pdf", id_matiere: 4},
                {id: 13, nom: "2023-2024", type: "examen", chemin_fichier: "./s1/Analyse/exam/SN-23.pdf", id_matiere: 4},
                {id: 14, nom: "2024-2025", type: "examen", chemin_fichier: "./s1/Analyse/exam/SN-25.pdf", id_matiere: 4},
                //rattrapage
                {id: 15, nom: "2021-2022", type: "rattrapage", chemin_fichier: "./s1/Analyse/rattrapage/SR-21.pdf", id_matiere: 4},
                {id: 16, nom: "2022-2023", type: "rattrapage", chemin_fichier: "./s1/Analyse/rattrapage/SR-22.pdf", id_matiere: 4},
                
                //Algebre
                //cours
                {id: 17, nom: "Logique, Ensembles, Applications et Relations", type: "cours", chemin_fichier: "./s1/Algebre/Cours/Logique, Ensembles, Applications et Relations.pdf", id_matiere: 5},
                {id: 18, nom: "Arithmétique dans Z", type: "cours", chemin_fichier: "./s1/Algebre/Cours/Arithmétique_dans_Z.pdf", id_matiere: 5},
                {id: 19, nom: "Structures Algébriques", type: "cours", chemin_fichier: "./s1/Algebre/Cours/Structures Algébriques.pdf", id_matiere: 5},
                //TD
                {id: 20, nom: "TD_01", type: "td", chemin_fichier: "./s1/Algebre/TD/TD1-Algebre.pdf", id_matiere: 5},
                {id: 21, nom: "TD_02", type: "td", chemin_fichier: "./s1/Algebre/TD/TD2-Algèbre.pdf", id_matiere: 5},
                {id: 22, nom: "TD_03", type: "td", chemin_fichier: "./s1/Algebre/TD/TD3-Algèbre.pdf", id_matiere: 5},
                //devoir
                {id: 23, nom: "2022-2023", type: "devoir", chemin_fichier: "./s1/Algebre/devoir/CC-22.pdf", id_matiere: 5},
                {id: 24, nom: "2023-2024", type: "devoir", chemin_fichier: "./s1/Algebre/devoir/CC-23.pdf", id_matiere: 5},
                {id: 25, nom: "2024-2025", type: "devoir", chemin_fichier: "./s1/Algebre/devoir/CC-24.pdf", id_matiere: 5},
                //examen
                {id: 26, nom: "2021-2022", type: "examen", chemin_fichier: "./s1/Algebre/exam/SN-21.pdf", id_matiere: 5},
                {id: 27, nom: "2022-2023", type: "examen", chemin_fichier: "./s1/Algebre/exam/SN-22.pdf", id_matiere: 5},
                {id: 28, nom: "2023-2024", type: "examen", chemin_fichier: "./s1/Algebre/exam/SN-23.pdf", id_matiere: 5},
                {id: 29, nom: "2024-2025", type: "examen", chemin_fichier: "./s1/Algebre/exam/SN-25.pdf", id_matiere: 5},
                
                //base reseaux
                //cours
                {id: 30, nom: "Introduction aux Réseaux", type: "cours", chemin_fichier: "./s1/bases réseaux/cours/Introduction aux Réseaux_SupNum_v2.pdf", id_matiere: 11},
                {id: 31, nom: "Les-services-réseaux", type: "cours", chemin_fichier: "./s1/bases réseaux/cours/Les-services-réseaux.pptx", id_matiere: 11},
                //TD
                {id: 32, nom: "TD_01", type: "td", chemin_fichier: "./s1/bases réseaux/TD/TD1-Réseaux.pdf", id_matiere: 11},
                {id: 33, nom: "TD_02", type: "td", chemin_fichier: "./s1/bases réseaux/TD/TD2-Réseaux.pdf", id_matiere: 11},
                {id: 34, nom: "TD_03", type: "td", chemin_fichier: "./s1/bases réseaux/TD/TD3-Réseaux.pdf", id_matiere: 11},
                //TP
                {id: 35, nom: "TP_01", type: "tp", chemin_fichier: "./s1/bases réseaux/TP/TP1-Réseaux.pdf", id_matiere: 11},
                {id: 36, nom: "TP_02", type: "tp", chemin_fichier: "./s1/bases réseaux/TP/TP2-Réseaux.pdf", id_matiere: 11},
                {id: 37, nom: "TP_03", type: "tp", chemin_fichier: "./s1/bases réseaux/TP/TP3-Réseaux.docx", id_matiere: 11},
                {id: 38, nom: "TP_04", type: "tp", chemin_fichier: "./s1/bases réseaux/TP/TP4 Wireshark + DHCP.pdf", id_matiere: 11},
                //devoir
                {id: 39, nom: "2021-2022", type: "devoir", chemin_fichier: "./s1/bases réseaux/devoir/CC-21.pdf", id_matiere: 11},
                {id: 40, nom: "2022-2023", type: "devoir", chemin_fichier: "./s1/bases réseaux/devoir/CC-22.pdf", id_matiere: 11},
                {id: 41, nom: "2023-2024", type: "devoir", chemin_fichier: "./s1/bases réseaux/devoir/CC-23.pdf", id_matiere: 11},
                {id: 42, nom: "2024-2025", type: "devoir", chemin_fichier: "./s1/bases réseaux/devoir/CC-24.pdf", id_matiere: 11},
                //examen
                {id: 43, nom: "2021-2022", type: "examen", chemin_fichier: "./s1/bases réseaux/exam/SN-21.pdf", id_matiere: 11},
                {id: 44, nom: "2022-2023", type: "examen", chemin_fichier: "./s1/bases réseaux/exam/SN-22.pdf", id_matiere: 11},
                {id: 45, nom: "2023-2024", type: "examen", chemin_fichier: "./s1/bases réseaux/exam/SN-23.pdf", id_matiere: 11},
                {id: 46, nom: "2024-2025", type: "examen", chemin_fichier: "./s1/bases réseaux/exam/SN-25.pdf", id_matiere: 11},
                //examen_pratique
                {id: 47, nom: "2023-2024", type: "examen_pratique", chemin_fichier: "./s1/bases réseaux/exam pratique/CP-23.pdf", id_matiere: 11},
                {id: 48, nom: "2024-2025", type: "examen_pratique", chemin_fichier: "./s1/bases réseaux/exam pratique/CP-25.pdf", id_matiere: 11},
                //rattrapage
                {id: 49, nom: "2021-2022", type: "rattrapage", chemin_fichier: "./s1/bases réseaux/rattrapage/SR-21.pdf", id_matiere: 11},
                {id: 50, nom: "2023-2024", type: "rattrapage", chemin_fichier: "./s1/bases réseaux/rattrapage/SR-23.pdf", id_matiere: 11},
                
                //base de donnée
                 //cours
                {id: 51, nom: "Chap 1-Introduction aux BD", type: "cours", chemin_fichier: "./s1/Base de Données/Cours/Chap 1-Introduction aux BD.pdf", id_matiere: 9},
                {id: 52, nom: "Chap 2-Modelisation", type: "cours", chemin_fichier: "./s1/Base de Données/Cours/Chap 2-Modelisation.pdf", id_matiere: 9},
                {id: 53, nom: "Chap 3 Introduction a SQL", type: "cours", chemin_fichier: "./s1/Base de Données/Cours/Chap 3 Introduction a SQL.pdf", id_matiere: 9},
                //TD
                {id: 54, nom: "TD_01", type: "td", chemin_fichier: "./s1/Base de Données/TD/TD1 23-24.pdf", id_matiere: 9},
                {id: 55, nom: "TD_01(corrigé)", type: "td", chemin_fichier: "./s1/Base de Données/TD/TD1 Conception Corrigé.pdf", id_matiere: 9},
                //TP
                {id: 56, nom: "TP_01", type: "tp", chemin_fichier: "./s1/Base de Données/TP/TP 1 SQL.pdf", id_matiere: 9},
                {id: 57, nom: "TP_02", type: "tp", chemin_fichier: "./s1/Base de Données/TP/TP2_24-25.pdf", id_matiere: 9},
                {id: 58, nom: "TP_02(télécharger pour tp_2)", type: "tp", chemin_fichier: "./s1/Base de Données/TP/TP2_24-25.sql", id_matiere: 9},
                {id: 59, nom: "TP_03", type: "tp", chemin_fichier: "./s1/Base de Données/TP/TP_03-24-25.pdf", id_matiere: 9},
                {id: 60, nom: "TP_03(télécharger pour tp_3)", type: "tp", chemin_fichier: "./s1/Base de Données/TP/TP_03-24-25.sql", id_matiere: 9},
                
                //devoir
                {id: 61, nom: "2021-2022", type: "devoir", chemin_fichier: "./s1/Base de Données/devoir/CC-21.pdf", id_matiere: 9},
                {id: 62, nom: "2022-2023", type: "devoir", chemin_fichier: "./s1/Base de Données/devoir/CC-22.pdf", id_matiere: 9},
                {id: 63, nom: "2023-2024", type: "devoir", chemin_fichier: "./s1/Base de Données/devoir/CC-23.pdf", id_matiere: 9},
                {id: 64, nom: "2024-2025", type: "devoir", chemin_fichier: "./s1/Base de Données/devoir/CC-24.pdf", id_matiere: 9},
                {id: 65, nom: "2023-2024(corrigé)", type: "devoir", chemin_fichier: "./s1/Base de Données/devoir/Corrigé_CC_23-24.pdf", id_matiere: 9},

                //examen
                {id: 66, nom: "2021-2022", type: "examen", chemin_fichier: "./s1/Base de Données/exam/SN-21.pdf", id_matiere: 9},
                {id: 67, nom: "2022-2023", type: "examen", chemin_fichier: "./s1/Base de Données/exam/SN-22.pdf", id_matiere: 9},
                {id: 68, nom: "2023-2024", type: "examen", chemin_fichier: "./s1/Base de Données/exam/SN-23.pdf", id_matiere: 9},
                {id: 69, nom: "2024-2025", type: "examen", chemin_fichier: "./s1/Base de Données/exam/SN-25.pdf", id_matiere: 9},
                //examen_pratique
                {id: 70, nom: "2023", type: "examen_pratique", chemin_fichier: "./s1/Base de Données/Exam pratique/CP-23.docx", id_matiere: 9},
                {id: 71, nom: "2023(suite)", type: "examen_pratique", chemin_fichier: "./s1/Base de Données/Exam pratique/CP-23.sql", id_matiere: 9},
                {id: 72, nom: "2025", type: "examen_pratique", chemin_fichier: "./s1/Base de Données/Exam pratique/CP-25.pdf", id_matiere: 9},
                {id: 73, nom: "2025(suite)", type: "examen_pratique", chemin_fichier: "./s1/Base de Données/Exam pratique/CP-25.sql", id_matiere: 9},
                //rattrapage
                {id: 74, nom: "2021-2022", type: "rattrapage", chemin_fichier: "./s1/Base de Données/Rattrapage/SR-22.pdf", id_matiere: 9},
                {id: 75, nom: "2022-2023", type: "rattrapage", chemin_fichier: "./s1/Base de Données/Rattrapage/SR-23.pdf", id_matiere: 9},
                {id: 76, nom: "2023-2024", type: "rattrapage", chemin_fichier: "./s1/Base de Données/Rattrapage/SR-24.pdf", id_matiere: 9},


                //technologie web
                 //cours
                {id: 77, nom: "Chapitre 1", type: "cours", chemin_fichier: "./s1/Technologie Web/cours/Chapitre1_v2.pdf", id_matiere: 8},
                {id: 78, nom: "Chapitre 2", type: "cours", chemin_fichier: "./s1/Technologie Web/cours/Chp2_CSS 24-25.pdf", id_matiere: 8},
                {id: 79, nom: "Chapitre3", type: "cours", chemin_fichier: "./s1/Technologie Web/cours/chapitre 4 JS.pdf", id_matiere: 8},
                {id: 80, nom: "Soutien_Js", type: "cours", chemin_fichier: "./s1/Technologie Web/cours/Soutien_Js.pdf", id_matiere: 8},
                {id: 81, nom: "Annexe", type: "cours", chemin_fichier: "./s1/Technologie Web/cours/Annexe.docx", id_matiere: 8},
                
                //TP
                {id: 82, nom: "TP_01", type: "tp", chemin_fichier: "./s1/Technologie Web/TP/TP1.pdf", id_matiere: 8},
                {id: 83, nom: "TP_02", type: "tp", chemin_fichier: "./s1/Technologie Web/TP/TP2.pdf", id_matiere: 8},
                {id: 84, nom: "TP_03", type: "tp", chemin_fichier: "./s1/Technologie Web/TP/TP3-TW.pdf", id_matiere: 8},
                {id: 85, nom: "TP_04", type: "tp", chemin_fichier: "./s1/Technologie Web/TP/TP4.pdf", id_matiere: 8},
                {id: 86, nom: "TP_04(suite)", type: "tp", chemin_fichier: "./s1/Technologie Web/TP/tp4 suite.pdf", id_matiere: 8},
                
                //devoir
                {id: 87, nom: "2021-2022", type: "devoir", chemin_fichier: "./s1/Technologie Web/devoir/CC-21.pdf", id_matiere: 8},
                {id: 88, nom: "2022-2023", type: "devoir", chemin_fichier: "./s1/Technologie Web/devoir/CC-22.pdf", id_matiere: 8},
                {id: 89, nom: "2023-2024", type: "devoir", chemin_fichier: "./s1/Technologie Web/devoir/CC-23.pdf", id_matiere: 8},
                {id: 90, nom: "2024-2025", type: "devoir", chemin_fichier: "./s1/Technologie Web/devoir/CC-24.pdf", id_matiere: 8},

                //examen
                {id: 91, nom: "2022-2023", type: "examen", chemin_fichier: "./s1/Technologie Web/exam/SN-22.pdf", id_matiere: 8},
                {id: 92, nom: "2023-2024", type: "examen", chemin_fichier: "./s1/Technologie Web/exam/SN-23.pdf", id_matiere: 8},
                {id: 93, nom: "2024-2025", type: "examen", chemin_fichier: "./s1/Technologie Web/exam/SN-25.pdf", id_matiere: 8},
                //examen_pratique
                {id: 94, nom: "2021-2022", type: "examen_pratique", chemin_fichier: "./s1/Technologie Web/exam pratique/CP-21.pdf", id_matiere: 8},
                {id: 95, nom: "2022-2023", type: "examen_pratique", chemin_fichier: "./s1/Technologie Web/exam pratique/CP-22.pdf", id_matiere: 8},
                {id: 96, nom: "2023-2024", type: "examen_pratique", chemin_fichier: "./s1/Technologie Web/exam pratique/CP-23.zip", id_matiere: 8},
                {id: 97, nom: "2024-2025", type: "examen_pratique", chemin_fichier: "./s1/Technologie Web/exam pratique/CP-25.pdf", id_matiere: 8},
                {id: 98, nom: "Mini Projet JS-2025", type: "examen_pratique", chemin_fichier: "./s1/Technologie Web/exam pratique/Mini Projet JS-25.pdf", id_matiere: 8},
                {id: 99, nom: "Mini Projet site web HTML-2022", type: "examen_pratique", chemin_fichier: "./s1/Technologie Web/exam pratique/Mini Projet site web HTML.pdf", id_matiere: 8},
                //rattrapage
                {id: 100, nom: "2023-2024", type: "rattrapage", chemin_fichier: "./s1/Technologie Web/rattrapage/SR-23.pdf", id_matiere: 8},
                
                //base info
                 //cours
                {id: 101, nom: "Chapitre 1", type: "cours", chemin_fichier: "./s1/Base info/Cours/cours1(BI).pdf", id_matiere: 10},
                {id: 102, nom: "Chapitre 2 (Windows)", type: "cours", chemin_fichier: "./s1/Base info/Cours/Chap2 _Windows.pdf", id_matiere: 10},
                {id: 103, nom: "Commande_Dos", type: "cours", chemin_fichier: "./s1/Base info/Cours/Commande_Dos.pdf", id_matiere: 10},
                {id: 104, nom: "Chapitre 3 (Word)", type: "cours", chemin_fichier: "./s1/Base info/Cours/Ch3_Word.ppt", id_matiere: 10},
                {id: 105, nom: "Chapitre 4 (Excel)", type: "cours", chemin_fichier: "./s1/Base info/Cours/CHAP4_Excel.ppt", id_matiere: 10},
                {id: 106, nom: "Chapitre 5 (PowerPoint)", type: "cours", chemin_fichier: "./s1/Base info/Cours/CH5_PowerPoint.ppt", id_matiere: 10},
                //TD
                {id: 107, nom: "TD_01", type: "td", chemin_fichier: "./s1/Base info/TD/TD1.pdf", id_matiere: 10},
                {id: 108, nom: "TD_02", type: "td", chemin_fichier: "./s1/Base info/TD/TD2.pdf", id_matiere: 10},
                //TP
                {id: 109, nom: "TP_01", type: "tp", chemin_fichier: "./s1/Base info/TP/TP1.pdf", id_matiere: 10},
                {id: 110, nom: "TP_02", type: "tp", chemin_fichier: "./s1/Base info/TP/TP2.pdf", id_matiere: 10},
                {id: 111, nom: "TP_03", type: "tp", chemin_fichier: "./s1/Base info/TP/TP3.zip", id_matiere: 10},
                
                //devoir
                {id: 112, nom: "2021-2022", type: "devoir", chemin_fichier: "./s1/Base info/devoir/CC(BI)-21.pdf", id_matiere: 10},
                {id: 113, nom: "2022-2023", type: "devoir", chemin_fichier: "./s1/Base info/devoir/CC(BI)-22.pdf", id_matiere: 10},
                {id: 114, nom: "2023-2024", type: "devoir", chemin_fichier: "./s1/Base info/devoir/CC(BI)-23.pdf", id_matiere: 10},
                {id: 115, nom: "2024-2025", type: "devoir", chemin_fichier: "./s1/Base info/devoir/CC(BI)-24.pdf", id_matiere: 10},

                //examen
                {id: 116, nom: "2021-2022", type: "examen", chemin_fichier: "./s1/Base info/exam/SN-21(BI).pdf", id_matiere: 10},
                {id: 117, nom: "2022-2023", type: "examen", chemin_fichier: "./s1/Base info/exam/SN-22(BI).pdf", id_matiere: 10},
                {id: 118, nom: "2023-2024", type: "examen", chemin_fichier: "./s1/Base info/exam/SN-23(BI).pdf", id_matiere: 10},
                {id: 119, nom: "2024-2025", type: "examen", chemin_fichier: "./s1/Base info/exam/SN-25(BI).pdf", id_matiere: 10},
                //examen_pratique
                {id: 120, nom: "2021-2022", type: "examen_pratique", chemin_fichier: "./s1/Base info/exam pratique/2021-2022.zip", id_matiere: 10},
                {id: 121, nom: "2022-2023", type: "examen_pratique", chemin_fichier: "./s1/Base info/exam pratique/2022-2023.zip", id_matiere: 10},
                {id: 122, nom: "2024-2025", type: "examen_pratique", chemin_fichier: "./s1/Base info/exam pratique/2024-2025.zip", id_matiere: 10},
                //rattrapage
                {id: 123, nom: "2022-2023", type: "rattrapage", chemin_fichier: "./s1/Base info/rattrapage/SR-23.pdf", id_matiere: 10},
                
                //pix
                //examen
                {id: 124, nom: "2023-2024", type: "examen", chemin_fichier: "./s1/PIX/exam/SN-22.pdf", id_matiere: 6},
                //rattrapage
                {id: 125, nom: "2023-2024", type: "rattrapage", chemin_fichier: "./s1/PIX/rattrapage/SR-23.pdf", id_matiere: 6},
                
                //Algo && C++
                //cours
                {id: 126, nom: "Chapitre_01", type: "cours", chemin_fichier: "./s1/Algo && C++/cours/EnvironnementInfo_Prt1.pdf", id_matiere: 7},
                {id: 127, nom: "Chapitre_02", type: "cours", chemin_fichier: "./s1/Algo && C++/cours/EnvironnementInfo_prt2 .pdf", id_matiere: 7},
                {id: 128, nom: "Chapitre_03", type: "cours", chemin_fichier: "./s1/Algo && C++/cours/ProgrammesSimples.pdf", id_matiere: 7},
                {id: 129, nom: "Chapitre_04", type: "cours", chemin_fichier: "./s1/Algo && C++/cours/StructuresProgrmmation.pdf", id_matiere: 7},
                {id: 130, nom: "Chapitre_05", type: "cours", chemin_fichier: "./s1/Algo && C++/cours/Fonctions-.pdf", id_matiere: 7},
                //TD
                {id: 131, nom: "TD_01", type: "td", chemin_fichier: "./s1/Algo && C++/TD/TD1-.pdf", id_matiere: 7},
                //TP
                {id: 132, nom: "TP_01", type: "tp", chemin_fichier: "./s1/Algo && C++/TP/TP1.pdf", id_matiere: 7},
                {id: 133, nom: "TP_02", type: "tp", chemin_fichier: "./s1/Algo && C++/TP/TP2.pdf", id_matiere: 7},
                {id: 134, nom: "TP_03", type: "tp", chemin_fichier: "./s1/Algo && C++/TP/TP3.pdf", id_matiere: 7},
                {id: 135, nom: "TP_04", type: "tp", chemin_fichier: "./s1/Algo && C++/TP/TP4.pdf", id_matiere: 7},
                
                //devoir
                {id: 136, nom: "2021-2022", type: "devoir", chemin_fichier: "./s1/Algo && C++/devoir/CC-21.pdf", id_matiere: 7},
                {id: 137, nom: "2022-2023", type: "devoir", chemin_fichier: "./s1/Algo && C++/devoir/CC-22.pdf", id_matiere: 7},
                {id: 138, nom: "2023-2024", type: "devoir", chemin_fichier: "./s1/Algo && C++/devoir/CC-23.pdf", id_matiere: 7},
                {id: 139, nom: "2024-2025", type: "devoir", chemin_fichier: "./s1/Algo && C++/devoir/CC-24.pdf", id_matiere: 7},
                

                //examen
                {id: 140, nom: "2022-2023", type: "examen", chemin_fichier: "./s1/Algo && C++/exam/SN-22.pdf", id_matiere: 7},
                {id: 141, nom: "2023-2024", type: "examen", chemin_fichier: "./s1/Algo && C++/exam/SN-23.pdf", id_matiere: 7},
                {id: 142, nom: "2024-2025", type: "examen", chemin_fichier: "./s1/Algo && C++/exam/SN-25.pdf", id_matiere: 7},
                //examen_pratique
                {id: 143, nom: "2022", type: "examen_pratique", chemin_fichier: "./s1/Algo && C++/exam pratique/CP-22.pdf", id_matiere: 7},
                {id: 144, nom: "2023", type: "examen_pratique", chemin_fichier: "./s1/Algo && C++/exam pratique/CP-23.pdf", id_matiere: 7},
                {id: 145, nom: "2025", type: "examen_pratique", chemin_fichier: "./s1/Algo && C++/exam pratique/CP-25.pdf", id_matiere: 7},
                //rattrapage
                {id: 146, nom: "2021-2022", type: "rattrapage", chemin_fichier: "./s1/Algo && C++/rattrapage/SR-21.pdf", id_matiere: 7},
                {id: 147, nom: "2022-2023", type: "rattrapage", chemin_fichier: "./s1/Algo && C++/rattrapage/SR-22.pdf", id_matiere: 7},
                {id: 148, nom: "2023-2024", type: "rattrapage", chemin_fichier: "./s1/Algo && C++/rattrapage/SR-24.pdf", id_matiere: 7},

                //suite
                {id: 149, nom: "2023-2024", type: "rattrapage", chemin_fichier: "./s1/Base info/rattrapage/SR-24.pdf", id_matiere: 10},
                {id: 150, nom: "2023-2024", type: "rattrapage", chemin_fichier: "./s1/Analyse/rattrapage/SR-23.pdf", id_matiere: 4}, 
                {id: 151, nom: "2023-2024", type: "rattrapage", chemin_fichier: "./s1/Algebre/rattrapage/SR-23.pdf", id_matiere: 5},


                //s2
                //anglais
                {id:152 , nom: "Student Book", type: "cours", chemin_fichier: "./s2/Anglais/HW Pre-Int 4th edSB.pdf", id_matiere: 12},
                {id: 153, nom: "WorkBook", type: "td", chemin_fichier: "./s2/Anglais/HW Pre-Int 4th edWB.pdf", id_matiere: 12 },
                //pix
                {id: 154, nom: "2023-2024", type: "examen", chemin_fichier: "./s2/pix/examen/SN-23.pdf", id_matiere: 17 },
                {id: 155, nom: "2024-2025", type: "examen", chemin_fichier: "./s2/pix/examen/SN-25.pdf", id_matiere: 17},
                //algebre
                    //cours
                {id: 156, nom: "Chapitre_01", type: "cours", chemin_fichier: "./s2/AlgebreⅡ/cours/Ch_1.pdf", id_matiere: 16},
                {id: 157, nom: "Chapitre_02", type: "cours", chemin_fichier: "./s2/AlgebreⅡ/cours/Ch_2.pdf", id_matiere: 16},
                {id: 158, nom: "Chapitre_03", type: "cours", chemin_fichier: "./s2/AlgebreⅡ/cours/Ch_3.pdf", id_matiere: 16},
                {id: 159, nom: "Chapitre_04 et 5", type: "cours", chemin_fichier: "./s2/AlgebreⅡ/cours/Ch_4 et 5.pdf", id_matiere: 16},
                    //td
                {id: 160, nom: "TD-01", type: "td", chemin_fichier: "./s2/AlgebreⅡ/TD/Algèbre II Série 1.pdf", id_matiere: 16},
                {id: 161, nom: "TD-02", type: "td", chemin_fichier: "./s2/AlgebreⅡ/TD/Algèbre II Série 2.pdf", id_matiere: 16},
                {id: 162, nom: "TD-03", type: "td", chemin_fichier: "./s2/AlgebreⅡ/TD/Algèbre II Série 3.pdf", id_matiere: 16},
                    //devoir
                {id: 163, nom: "2022-2023", type: "devoir", chemin_fichier: "./s2/AlgebreⅡ/devoir/CC-23.pdf", id_matiere: 16},
                {id: 164, nom: "2023-2024", type: "devoir", chemin_fichier: "./s2/AlgebreⅡ/devoir/CC-24.pdf", id_matiere: 16},
                {id: 165, nom: "2024-2025", type: "devoir", chemin_fichier: "./s2/AlgebreⅡ/devoir/CC-25.pdf", id_matiere: 16},
                    //examen
                {id: 166, nom: "2022-2023", type: "examen", chemin_fichier: "./s2/AlgebreⅡ/examen/SN-23.pdf", id_matiere: 16},
                {id: 167, nom: "2023-2024", type: "examen", chemin_fichier: "./s2/AlgebreⅡ/examen/SN-24.pdf", id_matiere: 16},
                {id: 168, nom: "2024-2025", type: "examen", chemin_fichier: "./s2/AlgebreⅡ/examen/SN-25.pdf", id_matiere: 16},
                    //rattrapage
                {id: 169, nom: "2023-2024", type: "rattrapage", chemin_fichier: "./s2/AlgebreⅡ/rattrapage/SR-24.pdf", id_matiere: 16},

                //proba et stat
                    //cours
                {id: 170, nom: "Chapitre_01", type: "cours", chemin_fichier: "./s2/Proba et stat/cours/proba.pdf", id_matiere: 15},
                {id: 171, nom: "Chapitre_02", type: "cours", chemin_fichier: "./s2/Proba et stat/cours/Cours de Statistique descriptive.pdf", id_matiere: 15},
                    //td
                {id: 172, nom: "TD-01", type: "td", chemin_fichier: "./s2/proba et stat/TD/TD de proba.pdf", id_matiere: 15},
                {id: 173, nom: "TD-02", type: "td", chemin_fichier: "./s2/proba et stat/TD/TD Statistique descriptive.pdf", id_matiere: 15},
                    //devoir
                {id: 174, nom: "2021-2022", type: "devoir", chemin_fichier: "./s2/proba et stat/devoir/CC-22.pdf", id_matiere: 15},
                {id: 175, nom: "2022-2023", type: "devoir", chemin_fichier: "./s2/proba et stat/devoir/CC-23.pdf", id_matiere: 15},
                {id: 176, nom: "2023-2024", type: "devoir", chemin_fichier: "./s2/proba et stat/devoir/CC-24.pdf", id_matiere: 15},
                {id: 177, nom: "2024-2025", type: "devoir", chemin_fichier: "./s2/proba et stat/devoir/CC-25.pdf", id_matiere: 15},
                {id: 178, nom: "2021-2022 Corrige", type: "devoir", chemin_fichier: "./s2/proba et stat/devoir/CC CORRIGE-22.pdf", id_matiere: 15},
                    //examen
                {id: 179, nom: "2021-2022", type: "examen", chemin_fichier: "./s2/proba et stat/examen/SN-22.pdf", id_matiere: 15},
                {id: 180, nom: "2023-2024", type: "examen", chemin_fichier: "./s2/proba et stat/examen/SN-24.pdf", id_matiere: 15},
                {id: 181, nom: "2024-2025", type: "examen", chemin_fichier: "./s2/proba et stat/examen/SN-25.pdf", id_matiere: 15},
                    //rattrapage
                {id: 182, nom: "2021-2022", type: "rattrapage", chemin_fichier: "./s2/proba et stat/rattrapage/SR-22.pdf", id_matiere: 15},
                {id: 183, nom: "2022-2023", type: "rattrapage", chemin_fichier: "./s2/proba et stat/rattrapage/SR-23.pdf", id_matiere: 15},
                {id: 184, nom: "2023-2024", type: "rattrapage", chemin_fichier: "./s2/proba et stat/rattrapage/SR-24.pdf", id_matiere: 15},
                
                //se
                    //cours
                {id: 186, nom: "Chapitre_01", type: "cours", chemin_fichier: "./s2/SE/cours/Chap1.pdf", id_matiere: 20},
                {id: 187, nom: "Chapitre_02", type: "cours", chemin_fichier: "./s2/SE/cours/Chap2.pdf", id_matiere: 20},
                {id: 188, nom: "Chapitre_03", type: "cours", chemin_fichier: "./s2/SE/cours/Chap3.pdf", id_matiere: 20},
                {id: 189, nom: "Chapitre_04", type: "cours", chemin_fichier: "./s2/SE/cours/Chap4.pdf", id_matiere: 20},
                {id: 190, nom: "Chapitre_05", type: "cours", chemin_fichier: "./s2/SE/cours/Chap5.pdf", id_matiere: 20},
                {id: 191, nom: "Les commandes fondamentales de Linux", type: "cours", chemin_fichier: "./s2/SE/cours/Les commandes fondamentales de Linux.pdf", id_matiere: 20},
                    //tp
                {id: 192, nom: "TP-01", type: "tp", chemin_fichier: "./s2/SE/TP/TP-01.pdf", id_matiere: 20},
                {id: 193, nom: "TP-02", type: "tp", chemin_fichier: "./s2/SE/TP/TP-02.pdf", id_matiere: 20},
                {id: 194, nom: "TP-03", type: "tp", chemin_fichier: "./s2/SE/TP/TP-03.pdf", id_matiere: 20},
                {id: 195, nom: "TP-04", type: "tp", chemin_fichier: "./s2/SE/TP/TP-04.pdf", id_matiere: 20},
                {id: 196, nom: "TP-05", type: "tp", chemin_fichier: "./s2/SE/TP/TP-05.pdf", id_matiere: 20},
                    //devoir
                {id: 197, nom: "2022-2023", type: "devoir", chemin_fichier: "./s2/SE/devoir/CC-23.pdf", id_matiere: 20},
                {id: 198, nom: "2023-2024", type: "devoir", chemin_fichier: "./s2/SE/devoir/CC-24.pdf", id_matiere: 20},
                {id: 199, nom: "2024-2025", type: "devoir", chemin_fichier: "./s2/SE/devoir/CC-25.pdf", id_matiere: 20},
                    //examen
                {id: 200, nom: "2022-2023", type: "examen", chemin_fichier: "./s2/SE/examen/SN-23.pdf", id_matiere: 20},
                {id: 201, nom: "2023-2024", type: "examen", chemin_fichier: "./s2/SE/examen/SN-24.pdf", id_matiere: 20},
                {id: 202, nom: "2024-2025", type: "examen", chemin_fichier: "./s2/SE/examen/SN-25.pdf", id_matiere: 20},
                    //pratque
                {id: 203, nom: "2024-2025", type: "examen_pratique", chemin_fichier: "./s2/SE/examen pratique/CP-25.pdf", id_matiere: 20},
                    //rattrapage
                {id: 204, nom: "2023-2024", type: "rattrapage", chemin_fichier: "./s2/SE/rattrapage/SR-24.pdf", id_matiere: 20},

                {id: 205, nom: "Chapitre_01", type: "cours", chemin_fichier: "./s2/SL/cours/Chapitre_01.pdf", id_matiere: 21},
                {id: 206, nom: "Chapitre_02", type: "cours", chemin_fichier: "./s2/SL/cours/Chapitre_02.pdf", id_matiere: 21},
                {id: 207, nom: "Chapitre_03", type: "cours", chemin_fichier: "./s2/SL/cours/Chapitre_03.pdf", id_matiere: 21},
                {id: 208, nom: "Chapitre_04", type: "cours", chemin_fichier: "./s2/SL/cours/Chapitre_04.pdf", id_matiere: 21},
            
                {id: 209, nom: "TD-01", type: "td", chemin_fichier: "./s2/SL/TD/TD-01.pdf", id_matiere: 21},
                {id: 210, nom: "TD-02", type: "td", chemin_fichier: "./s2/SL/TD/TD-02.pdf", id_matiere: 21},
                {id: 211, nom: "TD-03", type: "td", chemin_fichier: "./s2/SL/TD/TD-03.pdf", id_matiere: 21},
                {id: 212, nom: "TD-04", type: "td", chemin_fichier: "./s2/SL/TD/TD-04.pdf", id_matiere: 21},
                
                {id: 213, nom: "TP-01", type: "tp", chemin_fichier: "./s2/SL/TP/TP-01.pdf", id_matiere: 21},
                {id: 214, nom: "TP-02", type: "tp", chemin_fichier: "./s2/SL/TP/TP-02.pdf", id_matiere: 21},
                {id: 215, nom: "TP-03", type: "tp", chemin_fichier: "./s2/SL/TP/TP-03.pdf", id_matiere: 21},
                {id: 216, nom: "TP-04", type: "tp", chemin_fichier: "./s2/SL/TP/TP-04.pdf", id_matiere: 21},
                
                {id: 217, nom: "2022-2023", type: "devoir", chemin_fichier: "./s2/SL/devoir/CC-23.pdf", id_matiere: 21},
                {id: 218, nom: "2023-2024", type: "devoir", chemin_fichier: "./s2/SL/devoir/CC-24.pdf", id_matiere: 21},
                
                {id: 219, nom: "2022-2023", type: "examen", chemin_fichier: "./s2/SL/examen/SN-23.pdf", id_matiere: 21},
                {id: 220, nom: "2023-2024", type: "examen", chemin_fichier: "./s2/SL/examen/SN-24.pdf", id_matiere: 21},
                {id: 221, nom: "2024-2025", type: "examen", chemin_fichier: "./s2/SL/examen/SN-25.pdf", id_matiere: 21},
                
                {id: 222, nom: "2022-2023", type: "rattrapage", chemin_fichier: "./s2/SL/rattrapage/SR-23.pdf", id_matiere: 21},
                {id: 223, nom: "2023-2024", type: "rattrapage", chemin_fichier: "./s2/SL/rattrapage/SR-24.pdf", id_matiere: 21},
                
                {id: 224, nom: "Chapitre_01", type: "cours", chemin_fichier: "./s2/LW/cours/Cours_Web.pdf", id_matiere: 19},
                {id: 225, nom: "Chapitre_02", type: "cours", chemin_fichier: "./s2/LW/cours/Cours_JS.pdf", id_matiere: 19},

                {id: 226, nom: "TP-01", type: "tp", chemin_fichier: "./s2/LW/TP/TP1.pdf", id_matiere: 19},
                {id: 227, nom: "TP-02", type: "tp", chemin_fichier: "./s2/LW/TP/TP2.pdf", id_matiere: 19},
                {id: 228, nom: "TP-03", type: "tp", chemin_fichier: "./s2/LW/TP/TP3.pdf", id_matiere: 19},

                {id: 229, nom: "2022-2023", type: "devoir", chemin_fichier: "./s2/LW/devoir/CC-23.pdf", id_matiere: 19},
                {id: 230, nom: "2023-2024", type: "devoir", chemin_fichier: "./s2/LW/devoir/CC-24.pdf", id_matiere: 19},
                {id: 231, nom: "2024-2025", type: "devoir", chemin_fichier: "./s2/LW/devoir/CC-25.pdf", id_matiere: 19},

                {id: 232, nom: "2022-2023", type: "examen", chemin_fichier: "./s2/LW/examen/SN-23.pdf", id_matiere: 19},
                {id: 233, nom: "2023-2024", type: "examen", chemin_fichier: "./s2/LW/examen/SN-24.pdf", id_matiere: 19},
                {id: 234, nom: "2024-2025", type: "examen", chemin_fichier: "./s2/LW/examen/SN-25.pdf", id_matiere: 19},

                {id: 235, nom: "2023-2024", type: "examen_pratique", chemin_fichier: "./s2/LW/examen pratique/CP-24.pdf", id_matiere: 19},
                {id: 236, nom: "2024-2025", type: "examen_pratique", chemin_fichier: "./s2/LW/examen pratique/CP-25.pdf", id_matiere: 19},

                {id: 237, nom: "2023-2024", type: "rattrapage", chemin_fichier: "./s2/LW/rattrapage/SR-24.pdf", id_matiere: 19},

                {id: 238, nom: "Chapitre_01", type: "cours", chemin_fichier: "./s2/CMS && PAO/cours/Chapitre 1 .pdf", id_matiere: 24},
                {id: 239, nom: "Chapitre_02", type: "cours", chemin_fichier: "./s2/CMS && PAO/cours/Chapitre 2.pdf", id_matiere: 24},

                {id: 240, nom: "TP-01", type: "tp", chemin_fichier: "./s2/CMS && PAO/TP/TP-01.pdf", id_matiere: 24},
                {id: 241, nom: "TP-02", type: "tp", chemin_fichier: "./s2/CMS && PAO/TP/TP-02.pdf", id_matiere: 24},
                {id: 242, nom: "TP-03", type: "tp", chemin_fichier: "./s2/CMS && PAO/TP/TP-03.pdf", id_matiere: 24},
                {id: 243, nom: "TP-04", type: "tp", chemin_fichier: "./s2/CMS && PAO/TP/TP-04.pdf", id_matiere: 24},
                {id: 244, nom: "TP-05", type: "tp", chemin_fichier: "./s2/CMS && PAO/TP/TP-05.pdf", id_matiere: 24},
                {id: 245, nom: "TP-06", type: "tp", chemin_fichier: "./s2/CMS && PAO/TP/TP-06.pdf", id_matiere: 24},

                {id: 246, nom: "2023-2024", type: "examen", chemin_fichier: "./s2/CMS && PAO/examen/SN-24.pdf", id_matiere: 24},
                {id: 247, nom: "2024-2025", type: "examen", chemin_fichier: "./s2/CMS && PAO/examen/SN-25.pdf", id_matiere: 24},


                {id: 248, nom: "Chapitre_01", type: "cours", chemin_fichier: "./s2/SGBD/cours/Chapitre_01.pdf", id_matiere: 23},
                {id: 249, nom: "Chapitre_02", type: "cours", chemin_fichier: "./s2/SGBD/cours/Chapitre_02.pdf", id_matiere: 23},
                {id: 250, nom: "Chapitre_03", type: "cours", chemin_fichier: "./s2/SGBD/cours/Chapitre_03.pdf", id_matiere: 23},

                {id: 251, nom: "TP-01", type: "tp", chemin_fichier: "./s2/SGBD/TP/TP1.pdf", id_matiere: 23},
                {id: 252, nom: "TP-02", type: "tp", chemin_fichier: "./s2/SGBD/TP/TP2.pdf", id_matiere: 23},
                {id: 253, nom: "TP-03", type: "tp", chemin_fichier: "./s2/SGBD/TP/TP3.pdf", id_matiere: 23},
                {id: 254, nom: "telecharger pour les tp", type: "tp", chemin_fichier: "./s2/SGBD/TP/agence.xlsx", id_matiere: 23},
                {id: 255, nom: "telecharger pour les tp", type: "tp", chemin_fichier: "./s2/SGBD/TP/agencedb.sql", id_matiere: 23},

                {id: 256, nom: "2023-2024", type: "devoir", chemin_fichier: "./s2/SGBD/devoir/CC-24.pdf", id_matiere: 23},
                {id: 257, nom: "2024-2025", type: "devoir", chemin_fichier: "./s2/SGBD/devoir/CC-25.pdf", id_matiere: 23},

                {id: 258, nom: "2023-2024", type: "examen", chemin_fichier: "./s2/SGBD/examen/SN-24.pdf", id_matiere: 23},
                {id: 259, nom: "2024-2025", type: "examen", chemin_fichier: "./s2/SGBD/examen/SN-25.pdf", id_matiere: 23},

                {id: 260, nom: "2024-2025", type: "examen_pratique", chemin_fichier: "./s2/SGBD/examen_pratique/SGBD-25.zip", id_matiere: 23},

                {id: 261, nom: "Chapitre_01", type: "cours", chemin_fichier: "./s2/service_reseaux/cours/Chapitre_01.pdf", id_matiere: 22},
                {id: 262, nom: "Chapitre_02", type: "cours", chemin_fichier: "./s2/service_reseaux/cours/Chapitre_02.pdf", id_matiere: 22},
                {id: 263, nom: "Chapitre_03", type: "cours", chemin_fichier: "./s2/service_reseaux/cours/Chapitre_03.pdf", id_matiere: 22},

                {id: 264, nom: "TD-01", type: "td", chemin_fichier: "./s2/service_reseaux/TD/TD-01.pdf", id_matiere: 22},

                {id: 265, nom: "TP-01", type: "tp", chemin_fichier: "./s2/service_reseaux/TP/TP-01.pdf", id_matiere: 22},
                {id: 266, nom: "TP-02", type: "tp", chemin_fichier: "./s2/service_reseaux/TP/TP-02.pdf", id_matiere: 22},
                {id: 267, nom: "TP-03", type: "tp", chemin_fichier: "./s2/service_reseaux/TP/TP-03.pdf", id_matiere: 22},
                {id: 268, nom: "TP-04", type: "tp", chemin_fichier: "./s2/service_reseaux/TP/TP-04.pdf", id_matiere: 22},
                {id: 269, nom: "TP-DHCP", type: "tp", chemin_fichier: "./s2/service_reseaux/TP/TP-05.pdf", id_matiere: 22},
                {id: 270, nom: "TP-DNS", type: "tp", chemin_fichier: "./s2/service_reseaux/TP/TP-06.pdf", id_matiere: 22},
                {id: 271, nom: "TP-FTP", type: "tp", chemin_fichier: "./s2/service_reseaux/TP/TP-07.pdf", id_matiere: 22},

                {id: 272, nom: "2022-2023", type: "examen", chemin_fichier: "./s2/service_reseaux/examen/SN-23.pdf", id_matiere: 22},
                {id: 273, nom: "2023-2024", type: "examen", chemin_fichier: "./s2/service_reseaux/examen/SN-24.pdf", id_matiere: 22},
                {id: 274, nom: "2024-2025", type: "examen", chemin_fichier: "./s2/service_reseaux/examen/SN-25.pdf", id_matiere: 22},

                {id: 275, nom: "2024-2025", type: "examen_pratique", chemin_fichier: "./s2/service_reseaux/examen pratique/CP-25.pdf", id_matiere: 22},
                {id: 276, nom: "Mini projet 2025", type: "examen_pratique", chemin_fichier: "./s2/service_reseaux/examen pratique/mini-projet.pdf", id_matiere: 22},


                {id: 277, nom: "Cours_PYTHON", type: "cours", chemin_fichier: "./s2/Python/cours/Cours.pdf", id_matiere: 18},

                {id: 278, nom: "TP-01", type: "tp", chemin_fichier: "./s2/Python/TP/TP1.pdf", id_matiere: 18},
                {id: 279, nom: "TP-02", type: "tp", chemin_fichier: "./s2/Python/TP/TP2.pdf", id_matiere: 18},
                {id: 280, nom: "TP2-bis", type: "tp", chemin_fichier: "./s2/Python/TP/TP2-bis.pdf", id_matiere: 18},
                {id: 281, nom: "TP-Recursivite", type: "tp", chemin_fichier: "./s2/Python/TP/TP-Recursivite.pdf", id_matiere: 18},
                {id: 282, nom: "TP-MatplotLib", type: "tp", chemin_fichier: "./s2/Python/TP/TP_MatplotLib.pdf", id_matiere: 18},
                {id: 283, nom: "TP-openpyxl", type: "tp", chemin_fichier: "./s2/Python/TP/TP3.zip", id_matiere: 18},
                {id: 284, nom: "TP-traitement de fichier", type: "tp", chemin_fichier: "./s2/Python/TP/TP4.pdf", id_matiere: 18},
                {id: 285, nom: "TP-POO", type: "tp", chemin_fichier: "./s2/Python/TP/TP5-POO.pdf", id_matiere: 18},
                {id: 286, nom: "TP-07", type: "tp", chemin_fichier: "./s2/Python/TP/TP6.zip", id_matiere: 18},

                {id: 287, nom: "2022-2023", type: "devoir", chemin_fichier: "./s2/Python/devoir/CC-23.pdf", id_matiere: 18},
                {id: 288, nom: "2023-2024", type: "devoir", chemin_fichier: "./s2/Python/devoir/CC-24.pdf", id_matiere: 18},
                {id: 289, nom: "2024-2025", type: "devoir", chemin_fichier: "./s2/Python/devoir/CC-25.pdf", id_matiere: 18},

                {id: 290, nom: "2022-2023", type: "examen", chemin_fichier: "./s2/Python/examen/SN-23.pdf", id_matiere: 18},
                {id: 291, nom: "2023-2024", type: "examen", chemin_fichier: "./s2/Python/examen/SN-24.pdf", id_matiere: 18},
                {id: 292, nom: "2024-2025", type: "examen", chemin_fichier: "./s2/Python/examen/SN-25.pdf", id_matiere: 18},

                {id: 293, nom: "2022-2023", type: "examen_pratique", chemin_fichier: "./s2/Python/examen pratique/CP-23.zip", id_matiere: 18},
                {id: 294, nom: "2023-2024", type: "examen_pratique", chemin_fichier: "./s2/Python/examen pratique/CP-24.zip", id_matiere: 18},
                {id: 295, nom: "2024-2025", type: "examen_pratique", chemin_fichier: "./s2/Python/examen pratique/CP-25.zip", id_matiere: 18},

                {id: 296, nom: "2023-2024", type: "rattrapage", chemin_fichier: "./s2/Python/rattrapage/SR-24.pdf", id_matiere: 18},



                
                //s3
                //bd rss

                {id: 297, nom: "Cours base de donne et Conception des SI", type: "cours", chemin_fichier: "./s3/bd_csi/cours/bd_cours3.pdf", id_matiere: 38},
                
                {id: 298, nom: "TP-01", type: "tp", chemin_fichier: "./s3/bd_csi/TP/bd_tp1.pdf", id_matiere: 38},
                {id: 299, nom: "TP-02", type: "tp", chemin_fichier: "./s3/bd_csi/TP/bd_tp2.pdf", id_matiere: 38},
                {id: 300, nom: "telecharger pour les tp", type: "tp", chemin_fichier: "./s3/bd_csi/TP/scolarite.sql", id_matiere: 38},
                
                {id: 301, nom: "2024-2025", type: "devoir", chemin_fichier: "./s3/bd_csi/devoir/CC-25.pdf", id_matiere: 38},

                {id: 302, nom: "2024-2025", type: "examen", chemin_fichier: "./s3/bd_csi/examen/SN-25.pdf", id_matiere: 38},

                //bd cnm

                {id: 303, nom: "Cours base de donne et Conception des SI", type: "cours", chemin_fichier: "./s3/bd_csi/cours/bd_cours3.pdf", id_matiere: 46},
                {id: 304, nom: "TP-01", type: "tp", chemin_fichier: "./s3/bd_csi/TP/bd_tp1.pdf", id_matiere: 46},
                {id: 305, nom: "TP-02", type: "tp", chemin_fichier: "./s3/bd_csi/TP/bd_tp2.pdf", id_matiere: 46},
                {id: 306, nom: "telecharger pour les tp", type: "tp", chemin_fichier: "./s3/bd_csi/TP/scolarite.sql", id_matiere: 46},              
                {id: 307, nom: "2024-2025", type: "devoir", chemin_fichier: "./s3/bd_csi/devoir/CC-25.pdf", id_matiere: 46},
                {id: 308, nom: "2024-2025", type: "examen", chemin_fichier: "./s3/bd_csi/examen/SN-25.pdf", id_matiere: 46},

                //{id: , nom: "", type: "", chemin_fichier: "./s3/", id_matiere: },
                //GE
                {id: 309, nom: "cours_GE", type: "cours", chemin_fichier: "./s3/Gestion d_entreprise/cours/cours-GE.pdf", id_matiere: 29},
                {id: 310, nom: "TD-01", type: "td", chemin_fichier: "./s3/Gestion d_entreprise/TD/TD1.pdf", id_matiere: 29},
                {id: 311, nom: "TD-02", type: "td", chemin_fichier: "./s3/Gestion d_entreprise/TD/TD2.pdf", id_matiere: 29},
                {id: 312, nom: "TD-03", type: "td", chemin_fichier: "./s3/Gestion d_entreprise/TD/TD3.pdf", id_matiere: 29},
                {id: 313, nom: "TD-04", type: "td", chemin_fichier: "./s3/Gestion d_entreprise/TD/TD4.pdf", id_matiere: 29},
                {id: 314, nom: "TD-05", type: "td", chemin_fichier: "./s3/Gestion d_entreprise/TD/TD5.pdf", id_matiere: 29},
                {id: 315, nom: "2023-2024", type: "devoir", chemin_fichier: "./s3/Gestion d_entreprise/devoir/CC-24.pdf", id_matiere: 29},
                {id: 316, nom: "2023-2024", type: "examen", chemin_fichier: "./s3/Gestion d_entreprise/examen/SN-24.pdf", id_matiere: 29},

                //admin reseaux
                {id: 317, nom: "Cours-1", type: "cours", chemin_fichier: "./s3/admin_reseau/cours/admin_reseau_cours1.pdf", id_matiere: 36},
                {id: 318, nom: "Cours-2", type: "cours", chemin_fichier: "./s3/admin_reseau/cours/admin_reseau_cours2.pdf", id_matiere: 36},
                {id: 319, nom: "Cours-3", type: "cours", chemin_fichier: "./s3/admin_reseau/cours/admin_reseau_cours3.pdf", id_matiere: 36},
                {id: 320, nom: "Cours-4", type: "cours", chemin_fichier: "./s3/admin_reseau/cours/admin_reseau_cours4.pdf", id_matiere: 36},
                {id: 322, nom: "Cours-5", type: "cours", chemin_fichier: "./s3/admin_reseau/cours/admin_reseau_cours5.pdf", id_matiere: 36},
                {id: 322, nom: "Cours-6", type: "cours", chemin_fichier: "./s3/admin_reseau/cours/admin_reseau_cours6.pdf", id_matiere: 36},
                {id: 323, nom: "TD-01", type: "td", chemin_fichier: "./s3/admin_reseau/TD/td1.pdf", id_matiere: 36},
                {id: 324, nom: "TD-02", type: "td", chemin_fichier: "./s3/admin_reseau/TD/td2.pdf", id_matiere: 36},
                {id: 325, nom: "TD-03", type: "td", chemin_fichier: "./s3/admin_reseau/TD/td3.pdf", id_matiere: 36},
                {id: 326, nom: "TP-01", type: "tp", chemin_fichier: "./s3/admin_reseau/TP/tp1.pdf", id_matiere: 36},
                {id: 327, nom: "TP-02", type: "tp", chemin_fichier: "./s3/admin_reseau/TP/tp2.pdf", id_matiere: 36},
                {id: 328, nom: "TP-03", type: "tp", chemin_fichier: "./s3/admin_reseau/TP/tp3.pdf", id_matiere: 36},
                {id: 329, nom: "2022-2023", type: "devoir", chemin_fichier: "./s3/admin_reseau/devoir/CC-23.pdf", id_matiere: 36},

                //CMS
                {id: 330, nom: "Rappel ", type: "cours", chemin_fichier: "./s3/CMS&PAO2/cours/rappel cms-pao1.pdf", id_matiere: 43},
                {id: 331, nom: "Cours-1", type: "cours", chemin_fichier: "./s3/CMS&PAO2/cours/cours1.pdf", id_matiere: 43},
                {id: 332, nom: "Cours-2", type: "cours", chemin_fichier: "./s3/CMS&PAO2/cours/cours2.pdf", id_matiere: 43},
                {id: 333, nom: "Cours-3", type: "cours", chemin_fichier: "./s3/CMS&PAO2/cours/cours3.pdf", id_matiere: 43},
                {id: 334, nom: "Cours-4", type: "cours", chemin_fichier: "./s3/CMS&PAO2/cours/cours4.pdf", id_matiere: 43},

                {id: 335, nom: "2024-2025", type: "examen", chemin_fichier: "./s3/CMS&PAO2/examen/SN-25.pdf", id_matiere: 43},

                //ML
                {id: 336, nom: "Analyse Discriminante (AD) 1", type: "cours", chemin_fichier: "./s3/ML/cours/CM_AD_1.pdf", id_matiere: 30},
                {id: 337, nom: "Analyse Discriminante (AD)", type: "cours", chemin_fichier: "./s3/ML/cours/CM_AD.pdf", id_matiere: 30},
                {id: 338, nom: "Cours_Clustering", type: "cours", chemin_fichier: "./s3/ML/cours/CM_Clustering.pdf", id_matiere: 30},
                {id: 339, nom: "Cours_Regression", type: "cours", chemin_fichier: "./s3/ML/cours/CM_Regression.pdf", id_matiere: 30},
                {id: 340, nom: "Exemple_Regression", type: "cours", chemin_fichier: "./s3/ML/cours/Exemple_Regression.xlsx", id_matiere:30 },
                {id: 341, nom: "TP-01", type: "tp", chemin_fichier: "./s3/ML/TP/TP1.zip", id_matiere: 30},
                {id: 342, nom: "TP-02", type: "tp", chemin_fichier: "./s3/ML/TP/TP2.zip", id_matiere: 30},
                {id: 343, nom: "TP-03", type: "tp", chemin_fichier: "./s3/ML/TP/TP3.zip", id_matiere: 30},
                {id: 344, nom: "TP-04", type: "tp", chemin_fichier: "./s3/ML/TP/TP4.zip", id_matiere: 30},
                {id: 345, nom: "TP-05", type: "tp", chemin_fichier: "./s3/ML/TP/TP5.zip", id_matiere: 30},
                {id: 346, nom: "TP-06", type: "tp", chemin_fichier: "./s3/ML/TP/TP6.zip", id_matiere: 30},
                {id: 347, nom: "TP-07", type: "tp", chemin_fichier: "./s3/ML/TP/TP7.zip", id_matiere: 30},
                {id: 348, nom: "2023-2024", type: "devoir", chemin_fichier: "./s3/ML/devoir/CC-24.pdf", id_matiere:30 },
                {id: 349, nom: "2023-2024", type: "examen", chemin_fichier: "./s3/ML/examen/SN-24.pdf", id_matiere:30 },

                //JAVA
                {id: 350, nom: "Fiche EM Prog Java", type: "cours", chemin_fichier: "./s3/POO Java/cours/Fiche EM Prog Java.pdf", id_matiere: 32},
                {id: 351, nom: "Chapitre-01", type: "cours", chemin_fichier: "./s3/POO Java/cours/Chapitre 1 - Introduction java.pdf", id_matiere: 32},
                {id: 352, nom: "Livre de réference", type: "cours", chemin_fichier: "./s3/POO Java/cours/Livre de réference_PAV310.pdf", id_matiere: 32},
                {id: 353, nom: "TP-01", type: "tp", chemin_fichier: "./s3/POO Java/TP/TP-1.pdf", id_matiere: 32},
                {id: 354, nom: "TP-02", type: "tp", chemin_fichier: "./s3/POO Java/TP/TP-2.pdf", id_matiere: 32},
                {id: 355, nom: "TP-03", type: "tp", chemin_fichier: "./s3/POO Java/TP/TP-3.pdf", id_matiere: 32},
                {id: 356, nom: "2022-2023", type: "devoir", chemin_fichier: "./s3/POO Java/devoir/CC-23.pdf", id_matiere: 32},
                {id: 357, nom: "2023-2024", type: "devoir", chemin_fichier: "./s3/POO Java/devoir/CC-24.pdf", id_matiere: 32},
                {id: 358, nom: "2023-2024", type: "examen", chemin_fichier: "./s3/POO Java/examen/SN-24.pdf", id_matiere: 32},
                
                //python
                {id: 359, nom: "Cours_Django", type: "cours", chemin_fichier: "./s3/Python/cours/Cours_Django.pdf", id_matiere: 41},
                {id: 360, nom: "Cours_Flask ", type: "cours", chemin_fichier: "./s3/Python/cours/Cours_Flask.pdf", id_matiere: 41},
                {id: 361, nom: "TP-01", type: "tp", chemin_fichier: "./s3/Python/TP/TP1.pdf", id_matiere: 41},
                {id: 362, nom: "TP-02", type: "tp", chemin_fichier: "./s3/Python/TP/TP2.pdf", id_matiere: 41},
                {id: 363, nom: "TP-02 (EX3)", type: "tp", chemin_fichier: "./s3/Python/TP/EX3_TP2.pdf", id_matiere: 41},
                {id: 364, nom: "TP-03", type: "tp", chemin_fichier: "./s3/Python/TP/TP3.pdf", id_matiere: 41},
                {id: 365, nom: "TP-04", type: "tp", chemin_fichier: "./s3/Python/TP/TP4.pdf", id_matiere: 41},
                {id: 366, nom: "2023-2024", type: "devoir", chemin_fichier: "./s3/Python/devoir/CC-24.pdf", id_matiere: 41},
                {id: 367, nom: "2022-2023", type: "examen", chemin_fichier: "./s3/Python/examen/SN-23.pdf", id_matiere: 41},
                {id: 368, nom: "2023-2024", type: "examen", chemin_fichier: "./s3/Python/examen/SN-24.pdf", id_matiere: 41},
                {id: 369, nom: "Mini_Projet_Django", type: "examen_pratique", chemin_fichier: "./s3/Python/examen_pratique/Mini_Projet_Django.pdf", id_matiere: 41},
                {id: 370, nom: "Mini_Projet_Flask", type: "examen_pratique", chemin_fichier: "./s3/Python/examen_pratique/Mini_Projet_Flask.pdf", id_matiere: 41},
                
                //reseau mobile
                {id: 371, nom: "Cours-01", type: "cours", chemin_fichier: "./s3/reseau_mobile/cours/reseau_mobile_cours1.pdf", id_matiere: 35},
                {id: 372, nom: "Cours-02", type: "cours", chemin_fichier: "./s3/reseau_mobile/cours/reseau_mobile_cours2.pdf", id_matiere: 35},
                {id: 373, nom: "Cours-03", type: "cours", chemin_fichier: "./s3/reseau_mobile/cours/reseau_mobile_cours3.pdf", id_matiere: 35},
                {id: 374, nom: "Cours-04", type: "cours", chemin_fichier: "./s3/reseau_mobile/cours/reseau_mobile_cours4.pdf", id_matiere: 35},
                {id: 375, nom: "Cours-05", type: "cours", chemin_fichier: "./s3/reseau_mobile/cours/reseau_mobile_cours5.pdf", id_matiere: 35},
                {id: 376, nom: "Cours-06", type: "cours", chemin_fichier: "./s3/reseau_mobile/cours/reseau_mobile_cours6.pdf", id_matiere: 35},
                {id: 377, nom: "TD-01", type: "td", chemin_fichier: "./s3/reseau_mobile/TD/reseau_mobile_td1.pdf", id_matiere: 35},
                {id: 378, nom: "TD-02", type: "td", chemin_fichier: "./s3/reseau_mobile/TD/reseau_mobile_td2.pdf", id_matiere: 35},
                {id: 379, nom: "TP-01", type: "tp", chemin_fichier: "./s3/reseau_mobile/TP/reseau_mobile_tp1.pdf", id_matiere: 35},
                {id: 380, nom: "TP-02", type: "tp", chemin_fichier: "./s3/reseau_mobile/TP/reseau_mobile_tp2.pdf", id_matiere: 35},
                {id: 381, nom: "TP-03", type: "tp", chemin_fichier: "./s3/reseau_mobile/TP/reseau_mobile_tp3.pdf", id_matiere: 35},
                {id: 382, nom: "2024-2025", type: "devoir", chemin_fichier: "./s3/reseau_mobile/devoir/CC-25.pdf", id_matiere: 35},
                {id: 383, nom: "2024-2025", type: "examen", chemin_fichier: "./s3/reseau_mobile/examen/SN-25.pdf", id_matiere: 35},
                //{id: 384, nom: "", type: "", chemin_fichier: "./s3/reseau_mobile/", id_matiere: 35},

                //RO
                {id: 384, nom: "Introduction", type: "cours", chemin_fichier: "./s3/RO/cours/RO_01_Introduction.pdf", id_matiere: 31},
                {id: 385, nom: "résolution_graphique", type: "cours", chemin_fichier: "./s3/RO/cours/RO_02_résolution_graphique.pdf", id_matiere: 31},
                {id: 386, nom: "Simplexe_une_phase", type: "cours", chemin_fichier: "./s3/RO/cours/RO_03_Simplexe_une_phase.pdf", id_matiere: 31},
                {id: 387, nom: "Simplexe_2_phases_dualité", type: "cours", chemin_fichier: "./s3/RO/cours/RO_04_Simplexe_2_phases_dualité_B&B.pdf", id_matiere: 31},
                {id: 388, nom: "mélange_planification", type: "cours", chemin_fichier: "./s3/RO/cours/RO_05_mélange_planification.pdf", id_matiere: 31},
                {id: 389, nom: "bin_packing", type: "cours", chemin_fichier: "./s3/RO/cours/RO_06_bin_packing.pdf", id_matiere: 31},
                {id: 390, nom: "Solveur_SupNum", type: "cours", chemin_fichier: "./s3/RO/cours/Solveur_SupNum.xlsx", id_matiere: 31},
                {id: 391, nom: "TD-01", type: "td", chemin_fichier: "./s3/RO/TD/TD_RO_01.pdf", id_matiere: 31},
                {id: 392, nom: "TD-02", type: "td", chemin_fichier: "./s3/RO/TD/TD_RO_02.pdf", id_matiere: 31},
                {id: 393, nom: "TD-03", type: "td", chemin_fichier: "./s3/RO/TD/TD_RO_03.pdf", id_matiere: 31},
                {id: 394, nom: "TP-01", type: "tp", chemin_fichier: "./s3/RO/TP/TP_RO_01.pdf", id_matiere: 31},
                {id: 395, nom: "TP-02", type: "tp", chemin_fichier: "./s3/RO/TP/TP_RO_02.pdf", id_matiere: 31},
                {id: 396, nom: "TP-03", type: "tp", chemin_fichier: "./s3/RO/TP/TP_RO_03_Knapsack.pdf", id_matiere: 31},
                {id: 397, nom: "TP-04", type: "tp", chemin_fichier: "./s3/RO/TP/TP_RO_04_Bin_Packing.pdf", id_matiere: 31},
                {id: 398, nom: "2023-2024", type: "devoir", chemin_fichier: "./s3/RO/devoir/CC-24.pdf", id_matiere: 31},
                //{id: 399, nom: "2024-2025", type: "devoir", chemin_fichier: "./s3/RO/devoir/CC-25.pdf", id_matiere: 31},
                {id: 400, nom: "2023-2024", type: "examen", chemin_fichier: "./s3/RO/examen/SN-24.pdf", id_matiere: 31},
                {id: 401, nom: "2024-2025", type: "examen", chemin_fichier: "./s3/RO/examen/SN-25.pdf", id_matiere: 31},

                //multimedia avancee
                {id: 402, nom: "Chapitre_01", type: "cours", chemin_fichier: "./s3/Multimédia_avancées/cours/Chapitre_01.pdf", id_matiere: 45},
                {id: 403, nom: "Chapitre_02", type: "cours", chemin_fichier: "./s3/Multimédia_avancées/cours/Chapitre_02.pdf", id_matiere: 45},
                {id: 404, nom: "Chapitre_03", type: "cours", chemin_fichier: "./s3/Multimédia_avancées/cours/Chapitre_03.pdf", id_matiere: 45},
                {id: 405, nom: "Chapitre_04", type: "cours", chemin_fichier: "./s3/Multimédia_avancées/cours/Chapitre_04.pdf", id_matiere: 45},
                {id: 406, nom: "Chapitre_05", type: "cours", chemin_fichier: "./s3/Multimédia_avancées/cours/Chapitre_05.pdf", id_matiere: 45},
                {id: 407, nom: "Chapitre_06", type: "cours", chemin_fichier: "./s3/Multimédia_avancées/cours/Chapitre_06.pdf", id_matiere: 45},
                {id: 408, nom: "TD-01", type: "td", chemin_fichier: "./s3/Multimédia_avancées/TD/TD-01.pdf", id_matiere: 45},
                {id: 409, nom: "TD-02", type: "td", chemin_fichier: "./s3/Multimédia_avancées/TD/TD-02.pdf", id_matiere: 45},
                {id: 410, nom: "TD-03", type: "td", chemin_fichier: "./s3/Multimédia_avancées/TD/TD-03.pdf", id_matiere: 45},
                {id: 411, nom: "TD-04", type: "td", chemin_fichier: "./s3/Multimédia_avancées/TD/TD-04.pdf", id_matiere: 45},
                {id: 412, nom: "TP-01", type: "tp", chemin_fichier: "./s3/Multimédia_avancées/TP/TP-01.pdf", id_matiere: 45},
                {id: 413, nom: "TP-02", type: "tp", chemin_fichier: "./s3/Multimédia_avancées/TP/TP-02.pdf", id_matiere: 45},
                {id: 414, nom: "TP-03", type: "tp", chemin_fichier: "./s3/Multimédia_avancées/TP/TP-03.pdf", id_matiere: 45},
                {id: 415, nom: "TP-04", type: "tp", chemin_fichier: "./s3/Multimédia_avancées/TP/TP-04.pdf", id_matiere: 45},
                {id: 416, nom: "TP-05", type: "tp", chemin_fichier: "./s3/Multimédia_avancées/TP/TP-05.pdf", id_matiere: 45},
                {id: 417, nom: "TP-06", type: "tp", chemin_fichier: "./s3/Multimédia_avancées/TP/TP-06.pdf", id_matiere: 45},
                {id: 418, nom: "TP-07", type: "tp", chemin_fichier: "./s3/Multimédia_avancées/TP/TP-07.pdf", id_matiere: 45},
                {id: 419, nom: "TP-08", type: "tp", chemin_fichier: "./s3/Multimédia_avancées/TP/TP-08.pdf", id_matiere: 45},
                {id: 420, nom: "TP-python", type: "tp", chemin_fichier: "./s3/Multimédia_avancées/TP/TP-09.pdf", id_matiere: 45},
                {id: 421, nom: "2024-2024", type: "devoir", chemin_fichier: "./s3/Multimédia_avancées/devoir/CC-25.pdf", id_matiere: 45},
                {id: 422, nom: "2024-2025 (corriger)", type: "devoir", chemin_fichier: "./s3/Multimédia_avancées/devoir/CC-25_corriger.pdf", id_matiere: 45},
                {id: 423, nom: "2024-2025", type: "examen", chemin_fichier: "./s3/Multimédia_avancées/examen/SN-25.pdf", id_matiere: 45},
                {id: 424, nom: "2024-2025", type: "rattrapage", chemin_fichier: "./s3/Multimédia_avancées/rattrapage/SR-25.pdf", id_matiere: 45},

                //numerisation et codage
                {id: 425, nom: "Chapitre_01", type: "cours", chemin_fichier: "./s3/Numérisation&Codage/cours/Chapitre_01.pdf", id_matiere: 44},
                {id: 426, nom: "Chapitre_02", type: "cours", chemin_fichier: "./s3/Numérisation&Codage/cours/Chapitre_02.pdf", id_matiere: 44},
                {id: 427, nom: "Chapitre_03", type: "cours", chemin_fichier: "./s3/Numérisation&Codage/cours/Chapitre_03.pdf", id_matiere: 44},
                {id: 428, nom: "Chapitre_04", type: "cours", chemin_fichier: "./s3/Numérisation&Codage/cours/Chapitre_04.pdf", id_matiere: 44},
                {id: 429, nom: "TD-01", type: "td", chemin_fichier: "./s3/Numérisation&Codage/TD/TD-01.pdf", id_matiere: 44},
                {id: 430, nom: "TD-02", type: "td", chemin_fichier: "./s3/Numérisation&Codage/TD/TD-02.pdf", id_matiere: 44},
                {id: 431, nom: "TD-03", type: "td", chemin_fichier: "./s3/Numérisation&Codage/TD/TD-03.pdf", id_matiere: 44},
                {id: 432, nom: "CorrectionTdsNum25", type: "td", chemin_fichier: "./s3/Numérisation&Codage/TD/CorrectionTdsNum25.pdf", id_matiere: 44},
                {id: 433, nom: "TP-01", type: "tp", chemin_fichier: "./s3/Numérisation&Codage/TP/TP-01.pdf", id_matiere: 44},
                {id: 434, nom: "TP-02", type: "tp", chemin_fichier: "./s3/Numérisation&Codage/TP/TP-02.pdf", id_matiere: 44},
                {id: 435, nom: "TP-03", type: "tp", chemin_fichier: "./s3/Numérisation&Codage/TP/TP-03.pdf", id_matiere: 44},
                {id: 436, nom: "2024-2025", type: "devoir", chemin_fichier: "./s3/Numérisation&Codage/devoir/CC-25.pdf", id_matiere: 44},
                {id: 437, nom: "2024-2025 (corriger)", type: "devoir", chemin_fichier: "./s3/Numérisation&Codage/devoir/CC-25_corriger.pdf", id_matiere: 44},
                {id: 438, nom: "Mini-projet", type: "examen_pratiqu", chemin_fichier: "./s3/Numérisation&Codage/examen_pratique/Mini-projet.pdf", id_matiere: 44},
                {id: 439, nom: "2024-2025", type: "examen", chemin_fichier: "./s3/Numérisation&Codage/examen/SN-25.pdf", id_matiere: 44},
                //{id: 440, nom: "", type: "", chemin_fichier: "./s3/Numérisation&Codage/", id_matiere: 44},
                //
                //oracle
                {id: 440, nom: "DBAI01", type: "cours", chemin_fichier: "./s3/Oracle/cours/DBAI01.pdf", id_matiere: 40},
                {id: 441, nom: "cours-BD-4", type: "cours", chemin_fichier: "./s3/Oracle/cours/cours-BD-4.pdf", id_matiere: 40},
                {id: 442, nom: "Résume cours BDA", type: "cours", chemin_fichier: "./s3/Oracle/cours/Résume cours BDA.pdf", id_matiere: 40},
                {id: 443, nom: "TP-01", type: "tp", chemin_fichier: "./s3/Oracle/TP/TP-01.pdf", id_matiere: 40},
                {id: 444, nom: "2023-2024", type: "devoir", chemin_fichier: "./s3/Oracle/devoir/CC-24.pdf", id_matiere: 40},
                {id: 445, nom: "2024-2025", type: "devoir", chemin_fichier: "./s3/Oracle/devoir/CC-25.pdf", id_matiere: 40},
                {id: 446, nom: "2023-2024", type: "examen", chemin_fichier: "./s3/Oracle/examen/SN-24.pdf", id_matiere: 40},
                {id: 447, nom: "2024-2025", type: "examen", chemin_fichier: "./s3/Oracle/examen/SN-25.pdf", id_matiere: 40},


                //anglais
                {id: 448, nom: "Student Book", type: "cours", chemin_fichier: "./s3/anglais/cours/HW Pre-Int 4th edSB.pdf", id_matiere: 26},
                {id: 449, nom: "Unit_5-Vocabulary", type: "cours", chemin_fichier: "./s3/anglais/cours/Unit_5-Vocabulary-1.pdf", id_matiere: 26},
                {id: 450, nom: "Unit_6-Vocabulary", type: "cours", chemin_fichier: "./s3/anglais/cours/Unit_6-Vocabulary-1.pdf", id_matiere: 26},
                {id: 451, nom: "Unit_7-Vocabulary", type: "cours", chemin_fichier: "./s3/anglais/cours/Unit_7-Vocabulary-1.pdf", id_matiere: 26},
                {id: 452, nom: "Unit_8-Vocabulary", type: "cours", chemin_fichier: "./s3/anglais/cours/Unit_8-Vocabulary.pdf", id_matiere: 26},
                {id: 453, nom: "Irregular Verbs List", type: "cours", chemin_fichier: "./s3/anglais/cours/Irregular Verbs List.pdf", id_matiere: 26},
                {id: 454, nom: "Workbook", type: "tp", chemin_fichier: "./s3/anglais/cours/HW Pre-Int 4th edWB.pdf", id_matiere: 26},

                //geni logiciel
                {id: 455, nom: "Chapitre-01", type: "cours", chemin_fichier: "./s3/Génie Logiciel/cours/Chap1.pdf", id_matiere: 39},
                {id: 456, nom: "Chapitre-02", type: "cours", chemin_fichier: "./s3/Génie Logiciel/cours/Chap 2 OO.pdf", id_matiere: 39},
                {id: 457, nom: "Chapitre-03", type: "cours", chemin_fichier: "./s3/Génie Logiciel/cours/Chap 3 Diag de cas d_utilisation.pdf", id_matiere: 39},
                {id: 458, nom: "Chapitre-04", type: "cours", chemin_fichier: "./s3/Génie Logiciel/cours/Chap 4 Tests unitaires.pdf", id_matiere: 39},
                {id: 459, nom: "Script java (client)", type: "tp", chemin_fichier: "./s3/Génie Logiciel/TP/Client.java", id_matiere: 39},
                {id: 460, nom: "Script java (Movie)", type: "tp", chemin_fichier: "./s3/Génie Logiciel/TP/Movie.java", id_matiere: 39},
                {id: 461, nom: "Script java (Rental)", type: "tp", chemin_fichier: "./s3/Génie Logiciel/TP/Rental.java", id_matiere: 39},
                {id: 462, nom: "2023-2024", type: "devoir", chemin_fichier: "./s3/Génie Logiciel/devoir/CC-24.pdf", id_matiere: 39},
                {id: 463, nom: "2022-2023", type: "examen", chemin_fichier: "./s3/Génie Logiciel/examen/SN-23.pdf", id_matiere: 39},
                {id: 464, nom: "2023-2024", type: "examen", chemin_fichier: "./s3/Génie Logiciel/examen/SN-24.pdf", id_matiere: 39},
                {id: 465, nom: "2024-2025", type: "examen", chemin_fichier: "./s3/Génie Logiciel/examen/SN-25.pdf", id_matiere: 39},


                //securite
                {id: 466, nom: "Chapiter_01", type: "cours", chemin_fichier: "./s3/sécurité_S3/cours/Chapitre_01.pdf", id_matiere: 37},
                {id: 467, nom: "Chapiter_02", type: "cours", chemin_fichier: "./s3/sécurité_S3/cours/Chapitre_02.pdf", id_matiere: 37},
                {id: 468, nom: "Chapiter_03", type: "cours", chemin_fichier: "./s3/sécurité_S3/cours/Chapitre_03.pdf", id_matiere: 37},
                {id: 469, nom: "Chapiter_04", type: "cours", chemin_fichier: "./s3/sécurité_S3/cours/Chapitre_04.pdf", id_matiere: 37},

                {id: 470, nom: "TD-01", type: "td", chemin_fichier: "./s3/sécurité_S3/TD/TD-01.pdf", id_matiere: 37},
                {id: 471, nom: "HW1", type: "tp", chemin_fichier: "./s3/sécurité_S3/TP/hw1.pdf", id_matiere: 37},
                {id: 472, nom: "TP-01", type: "tp", chemin_fichier: "./s3/sécurité_S3/TP/tp1.pdf", id_matiere: 37},
                {id: 473, nom: "2024-2025", type: "examen", chemin_fichier: "./s3/sécurité_S3/examen/SN-25.pdf", id_matiere: 37},

                //devops
                {id: 474, nom: "Chapitre_01", type: "cours", chemin_fichier: "./s3/DevOps/cours/chapiter01.pdf", id_matiere: 42},
                {id: 475, nom: "Chapitre_02", type: "cours", chemin_fichier: "./s3/DevOps/cours/chapitre02.pdf", id_matiere: 42},
                {id: 476, nom: "Chapitre_03", type: "cours", chemin_fichier: "./s3/DevOps/cours/chapitre03.pdf", id_matiere: 42},
                {id: 477, nom: "Chapitre_04", type: "cours", chemin_fichier: "./s3/DevOps/cours/chapitre04.pdf", id_matiere: 42},
                {id: 478, nom: "Chapitre_05", type: "cours", chemin_fichier: "./s3/DevOps/cours/Tests Continus - Pilier de la Qualite- DevOps-4.pdf", id_matiere: 42},
                {id: 479, nom: "Chapitre_06", type: "cours", chemin_fichier: "./s3/DevOps/cours/jenkins_Introduction.pdf", id_matiere: 42},

                {id: 480, nom: "tp_01", type: "tp", chemin_fichier: "./s3/DevOps/TP/TP _ Git - Gestion de version et Collaboration.pdf", id_matiere: 42},
                {id: 481, nom: "tp_02", type: "tp", chemin_fichier: "./s3/DevOps/TP/TP Docker - Getting Started_1.pdf", id_matiere: 42},

                {id: 482, nom: "2023-2024", type: "devoir", chemin_fichier: "./s3/DevOps/devoir/CC-24.pdf", id_matiere: 42},
                {id: 483, nom: "2023-2024", type: "examen", chemin_fichier: "./s3/DevOps/examen/SN-24.pdf", id_matiere: 42},
                {id: 484, nom: "2024-2025", type: "examen", chemin_fichier: "./s3/DevOps/examen/SN-25.pdf", id_matiere: 42},

                //SD && C++
                {id: 485, nom: "Chapitre-01", type: "cours", chemin_fichier: "./s3/SD C++/cours/Chapitre_01.pdf", id_matiere: 33},
                {id: 486, nom: "Chapitre-02", type: "cours", chemin_fichier: "./s3/SD C++/cours/Chapitre_02.pdf", id_matiere: 33},
                {id: 487, nom: "Chapitre-03", type: "cours", chemin_fichier: "./s3/SD C++/cours/Chapitre_03.pdf", id_matiere: 33},
                {id: 488, nom: "Chapitre-04", type: "cours", chemin_fichier: "./s3/SD C++/cours/Chapitre_04.pdf", id_matiere: 33},
                {id: 489, nom: "Chapitre-05", type: "cours", chemin_fichier: "./s3/SD C++/cours/Les Listes Chaînées.pdf", id_matiere: 33},
                {id: 490, nom: "Chapitre-06", type: "cours", chemin_fichier: "./s3/SD C++/cours/Algo_CM5.pdf", id_matiere: 33},
                {id: 491, nom: "TD-Révision", type: "td", chemin_fichier: "./s3/SD C++/TD/TD-Révision.pdf", id_matiere: 33},
                {id: 492, nom: "TD-01", type: "td", chemin_fichier: "./s3/SD C++/TD/TD1.pdf", id_matiere: 33},
                {id: 493, nom: "TP-01", type: "tp", chemin_fichier: "./s3/SD C++/TP/TP1.zip", id_matiere: 33},
                {id: 494, nom: "TP-2_3", type: "tp", chemin_fichier: "./s3/SD C++/TP/TP_2_3.zip", id_matiere: 33},
                {id: 495, nom: "TP_tri", type: "tp", chemin_fichier: "./s3/SD C++/TP/TP_tri.zip", id_matiere: 33},
                {id: 496, nom: "TP_arbre", type: "tp", chemin_fichier: "./s3/SD C++/TP/TP_arbre.zip", id_matiere: 33},
                {id: 497, nom: "2023-2024", type: "devoir", chemin_fichier: "./s3/SD C++/devoir/CC-24.pdf", id_matiere: 33},
                {id: 498, nom: "2023-2024 (corriger)", type: "devoir", chemin_fichier: "./s3/SD C++/devoir/CC-24_corriger.pdf", id_matiere: 33},
                {id: 499, nom: "2024-2025", type: "devoir", chemin_fichier: "./s3/SD C++/devoir/CC-25.pdf", id_matiere: 33},
                {id: 500, nom: "2023-2024", type: "examen", chemin_fichier: "./s3/SD C++/examen/SN-24.pdf", id_matiere: 33},
                {id: 501, nom: "2024-2025", type: "examen", chemin_fichier: "./s3/SD C++/examen/SN-25.pdf", id_matiere: 33},


                //suite

                
                //ge
                {id: 315, nom: "2024-2025", type: "devoir", chemin_fichier: "./s3/Gestion d_entreprise/devoir/CC-25.pdf", id_matiere: 29},
                {id: 315, nom: "2024-2025", type: "examen", chemin_fichier: "./s3/Gestion d_entreprise/examen/SN-25.pdf", id_matiere: 29},
                //ML
                {id: 349, nom: "2024-2025", type: "examen", chemin_fichier: "./s3/ML/examen/SN-25.pdf", id_matiere:30 },
                //RO
                {id: 392, nom: "TD-04", type: "td", chemin_fichier: "./s3/RO/TD/TD_RO_04.pdf", id_matiere: 31},
                //java
                {id: 357, nom: "2024-2025", type: "devoir", chemin_fichier: "./s3/POO Java/devoir/CC-25.pdf", id_matiere: 32},
                {id: 357, nom: "2024-2025", type: "examen", chemin_fichier: "./s3/POO Java/examen/SN-25.pdf", id_matiere: 32},
                //admin_reseaux
                {id: 329, nom: "2024-2025", type: "devoir", chemin_fichier: "./s3/admin_reseau/devoir/CC-25.pdf", id_matiere: 36},
                {id: 329, nom: "2022-2023", type: "examen", chemin_fichier: "./s3/admin_reseau/examen/SN-23.pdf", id_matiere: 36},

               



            ]
        };
