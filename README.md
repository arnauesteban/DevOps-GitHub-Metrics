# LOG680 – Introduction au DevOps

## Lab#1: GitHub API et projet Kanban

## **Table des matières:**
>[Nos répertoires GitHub](#nos-répertoires-github)
>
>[Création d’un projet et du tableau Kanban dans GitHub](#création-dun-projet-et-du-tableau-kanban-dans-github)
>
>[Création des étiquettes](#création-des-étiquettes)
>
>[Ajout de modèles](#ajout-de-modèles)
>
>[Création des milestones](#création-des-milestones)
>
>[Politiques de branches](#politiques-de-branches)

### Nos répertoires GitHub

>Pour ce projet, nous avons créé un repo GitHub et deux projets GitHub. 
>
> Le premier repo est le repo principal. Dans ce repo se trouve le code complet de l'api de visionnement de GitHub développée:
>
>https://github.com/arnauesteban/labo-devops-g14-a23.git
>
>Puis, pour la gestion des tâches du projet, nous avons créé un projet sur Github. Dans celui-ci, il y a un tableau Kanban ou les tâches sont distribuées en diverses catégories selon leurs cheminement. Le lien du projet associé à ce projet est le:
>
>https://github.com/users/arnauesteban/projects/2
>
>Afin de pouvoir tester si notre API fonctionne, nous avons créé un autre projet dans un compte différent. Ce projet est accessible avec le lien:
>
>https://github.com/users/Shodaisd/projects/1

### Création d’un projet et du tableau Kanban dans GitHub
#### **Choix des colonnes du Kanban**
>Afin de pouvoir organiser le cheminement des tâches,  diverses colonnes ont été utilisée. Dans ce tableau, nous avions cinq sections:
>
>**Backlog:** Toutes les tâches que nous pouvions imaginer, mais qui n'allait pas faire partie de l'itération.
>
>**À faire:** Toutes les tâches à faire durant l'itération courante.
>
>**En cours:** Les tâches qu'un développeur a decidé d'entreprendre, tiré de la section à faire. Dans cette section, nous avions décider de ne pas prendre plus de deux tâches par développeur. De cette façon, un développeur ne peut pas prendre un nombre illimité de tâches en même temps. Il doit finir les tâches qu'il a anvant de progresser pour de nouvelles tâches. Ceci avait pour but de promouvoir le travail complété et de favoriser la productivité. 
>
>Si pour une raison quelquonque, le développeur n'arrive pas à terminer la tâche choisie, même avec l'aide de collègues, la tâche devait être remise dans la section à faire.
>
>Une fois la tâche complété, elle devait être associée à une pullrequest de la branche approrié. Cette façon de faire nous permet de voir quelle tâche est associée à quel section de code pour pouvoir voir les modifications facilement, puis la tâche est déplacée dans la section revue.
>
>**Revue:** La revue est une section ou les collègues révisent le code et le travail de quelqu'un d'autre dans l'équipe. Pour se faire, le collègue doit regarder la pullrequest créée et donner son approbation pour que le travail soit fusionné dans la branche develop. Nous avons créé cette section pour s'assurer de la qualité du travail et si le code performe de la façon attendue. Une fois la tâche vérifiée, elle est déplacée dans la section complétée.
>
>
>**Complétée:** Cette section contient toutes les tâches complétée durant le projet. 

**Choix pour les automatisations**
>Afin d'automatiser la chaîne de travail nous avons configuré certains workflows. 
>
>Quand une tâche est nouvellement créée elle va se positionner automatiquement dans la section backlog. De cette manière, des tâches ne peuvent pas être créées dans des colonnes au hazard. Une tâche doit commencer dans la section backlog, puis tirée dans les diverses colonne au fur et à mesure de son cheminement.
>
>Quand une tâche est fermée, elle est automatiquement transférrée dans la section complétée. De cette façon, nous n'avons pas à déplacer les tâches dans la colonne complétée.
>
>Quand une tâche est réouverte pour un ajustement, elle se met automatiquement dans la section à faire. Ensuite, un développeur pourra, ouvrir la tâche et lire les commentaires sur la raison de sa réouverture et s'il le veut, prendre la tâche.
>
>Nous avons décider d'automatiser le placement des tâches selon leurs états pour avoir à faire moins de déplacement de tâches dans le tableau Kanban et pour ainsi limiter les erreurs liés au déplacement des tâches.

### Création des étiquettes

### Ajout de modèles

### Création des milestones
>Pour ce projet, nous avons créé 3 milestones. Nous les avons appelés labo#1, labo#2 et labo#3. Ces milestones représentent les itérations que nous faisons. Chacune de ses itérations a un nombre de fonctionnalités à couvrir demandées par nos client. Puis au cours du développement, nous décidons ce qui est prioritaire pour décider l'ordre dans lequel les tâches seront faites durant l'itération. Chaque tâche est assocée à une milestone. Si une tâche n'est pas faite durant l'itération, nous pourrons voir qu'elle est en retard parce qu'elle était associée à une milestone.
### Politiques de branches


//>Afin de pouvoir automatiser le test des routes, nous avons utilisé postman. Pour se faire, nous avons créé un fichier JSON avec les routes à appeller et les divers paramètres utilisés.
>
>De plus, des JUnit tests ont étés créés pour tester les fonctions et les résultats retournés.