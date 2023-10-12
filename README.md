# LOG680 – Introduction au DevOps

## GitHub API et projet Kanban Wiki 

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
>
>[Tests et démontration](#tests-et-démonstration)

## Nos répertoires GitHub

https://github.com/arnauesteban/labo-devops-g14-a23/blob/develop/docs/Repertoires_GitHub.md

## Création d’un projet et du tableau Kanban dans GitHub
**Choix des colonnes du Kanban**

https://github.com/arnauesteban/labo-devops-g14-a23/blob/develop/docs/Choix_Colonne_Kanban.md

**Choix pour les automatisations**

https://github.com/arnauesteban/labo-devops-g14-a23/blob/develop/docs/Choix_automatisations_workflow.md

## Création des étiquettes
https://github.com/arnauesteban/labo-devops-g14-a23/blob/develop/docs/Choix_des_labels.md

## Ajout de modèles
**Choix des modèles pour les tâches (issues)**

Dépendamment des tâches que nous allions entreprendre dans le projet, nous avons créé différents modèles pour les représenter. Ces modèles permettent d'avoir un standard sur la forme par rapport à laquelle une tâche est présentée selon le type de tâche. Aussi, elle nous permettent d'être plus efficace pour la création des tâches, car dans le modèle, nous avons un formulaire pré-établi à remplir pour décrire la tâche à accomplir. De plus, dans ces formulaires, tout les aspects des tâches sont abordés. Alors, avec cette méthodologie, nous ne pouvons pas oublier de détails concernant la tâche à créer.

Nous avons créé 4 modèles pour les différentes tâches, pour les bugs, les fonctionnalités (features), l'initialisation (setup) et les améliorations (upgrade). Nous avons créé ces 4 modèles sur les tâches que nous pensons rencontrés au cours des itérations. S'il s'avère qu'une tâche à créer ne respecte pas ces modèles, nous pouvons toujours utiliser la tâches vide de Github pour la créer. Si nous remarquons que ce type de tâche est récurrent, nous créerons un nouveau modèle pour cette tâche. 

**Choix pour les modèles des Pull Requests**

Pour les Pull Requests, deux modèles ont été créés. Un modèle pour la création des fonctionnalités et un modèle pour la sortie du code final (release). Les fonctionnalités créées sont fusionnées dans la branche develop avec la pull request. Ce modèle nous permet d'avoir un résumé sur la fonctionnalité créé, de quelle façon elle a été testée et d'autres détails. Une fois le code complété pour l'itération nous pouvons fusionner la branche develop dans la branche release en utilisant une pull request de modèle release. Ce modèle de pull request a un formulaire à l'intérieur à remplir détaillant un résumé des fonctionnalités, des instructions sur le déploiement du code et sur comment le code a été testé. Ce même type de Pull Request est aussi utilisé pour faire la fusion du code dans le main à partir de la branche release.

Nous avons opté pour cette façon de faire pour standardiser ce qui est écrit dans les pull requests, d'augmenter notre efficacité par rapport à la création de pull request et pour éviter les erreurs ou le manque d'information dans celles-ci.

## Création des milestones

https://github.com/arnauesteban/labo-devops-g14-a23/blob/develop/docs/Cr%C3%A9ation_Milestones.md

## Politiques de branches
https://github.com/arnauesteban/labo-devops-g14-a23/blob/develop/docs/Choix_Politique_de_branches.md

## Tests et démonstration 
>Afin de pouvoir automatiser l'affichage du test des routes pour la démonstration, nous avons utilisé postman. Pour se faire, nous avons créé un fichier JSON avec les routes à appeller et les divers paramètres utilisés.
>
>De plus, des JUnit tests ont étés créés pour tester les fonctions et les résultats retournés.