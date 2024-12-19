# 🎭 **Backstage Setup & Usage**

## 📋 **Table des matières**
1. [Introduction](#introduction)
2. [Prérequis](#prérequis)
3. [Installation de Backstage](#installation-de-backstage)
4. [Création d'un template](#création-dun-template)
5. [Ajout d'un service lié à un repo](#ajout-dun-service-lié-à-un-repo)
6. [Utilisation du plugin README](#utilisation-du-plugin-readme)

---

## 🚀 **Introduction**

Ce projet met en place un environnement **Backstage** qui inclut :
- La **création d'un template** (non fonctionnel à l'heure actuelle).
- L'ajout d'un **service lié à un dépôt de test**.
- L'intégration du plugin **README** pour afficher un fichier `README.md` dans l'interface Backstage.

Ce projet peut servir de base pour tester et explorer les fonctionnalités principales de Backstage.

---

## 🛠️ **Prérequis**

Avant de commencer, assure-toi d'avoir installé les outils suivants :

1. **Node.js** (version ≥ 14.x)
2. **Yarn** (gestionnaire de paquets)
3. **Git** (pour versionner les fichiers)

Tu peux vérifier les versions installées avec :
```bash
node --version
yarn --version
git --version
```
---

## 🏗️ **Installation de Backstage**

1. **Cloner le projet Backstage :**

```bash
git clone https://github.com/AmongCorp/AmogStage.git
cd AmogStage
```

2. **Installer les dépendances avec Yarn :**

```bash
yarn install
```

3. **Démarrer le projet :**

```bash
yarn start
```

4. **Accéder à l'interface Backstage :** [http://localhost:3000](http://localhost:3000)

---

## 📁 **Création d'un template**

Un template permet d'automatiser la création de projets ou de ressources dans Backstage.

Exemple de fichier ``another-template.yaml`` (actuellement inutilisable pour des tests) :

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: example-service
  title: Example Service
  description: Crée un exemple de service pour tester Backstage
spec:
  owner: guests
  type: service
  parameters:
    - title: Service Name
      required:
        - name
      properties:
        name:
          type: string
          description: Nom unique du service

  steps:
    - id: fetch-base
      name: Fetch Template
      action: fetch:template
      input:
        url: ./content
        values:
          name: ${{ parameters.name }}
```

Ce template est **non fonctionnel** actuellement mais montre un exemple simple de définition.

---

## 📂 **Ajout d'un service lié à un repo**

Tu peux ajouter manuellement un service pour des tests avec le fichier ``entities.yaml`` :

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: example-service
  annotations:
    backstage.io/techdocs-ref: dir:.
  description: Service de test pour Backstage
spec:
  type: service
  owner: guests
  lifecycle: experimental
```

---

## 📖 **Utilisation du plugin README**

Le plugin README permet d'afficher le contenu d'un fichier `README.md` dans l'interface Backstage.
Il se situe dans le dossier `examples/template/content` et est activé par défaut.

--- 

📧 **Pour toute question ou suggestion** : *contactez-vous directement via ce repo !*