## Politiques de branches

>Pour la gestion de branches dans le repo de GitHub, nous avons opté d'utiliser 3 branches principale: Main, release et develop.
>
>La branche develop est la branche de developpement de toutes les fonctionnalités. Toutes les nouvelles branches faisant attrait à une nouvelle fonctionnalités seront basées sur cette branche. Puis une fois la fonctionnalités terminée, la branche contenant la nouvelle fonctionnalité se fera fusionner dans la branche develop.
>
>Une fois l'itération complétée et que la branche develop est totalement fonctionnelle, la branche develop se fait fusionner dans la branche Release. Cette branche a pour but de représenter une version tentative de release. S'il y a des problèmes qui n'ont pas été remarqué dans la version develop, ils seront réglés dans la branche release.
>
>Une fois que nous sommes certains de notre version finale dans la branche release, nous la fusionnons dans la branche main. Le code dans la branche Main est final pour cette itération (milestone). Pour l'itération suivante, les branches develop et release seront rebasé sur la branche main contenant le code de l'itération précédente.
>
>Cette façon de faire nous permet de ne pas avoir de conflit pour la fusion du code, surtout dans la branche main qui est la branche finale. Aussi, ça nous permet de voir, de façon claire, les changements dans la branche develop au fil du temps et d'avoir une consistence dans notre méthodologie de travail.