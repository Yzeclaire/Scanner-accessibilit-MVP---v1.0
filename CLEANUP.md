# Instructions de nettoyage

Les packages `pa11y`, `axe-core`, `playwright` ont été supprimés du `package.json`, mais ils sont encore dans `node_modules`.

## Pour résoudre l'erreur de build :

1. **Supprimez node_modules et package-lock.json** :
```bash
rm -rf node_modules package-lock.json
```

2. **Réinstallez les dépendances** :
```bash
npm install
```

3. **Redémarrez le serveur de développement** :
```bash
npm run dev
```

Cela devrait résoudre l'erreur "Module not found: Can't resolve './ROOT/node_modules/pa11y/lib/runners/axe'".

