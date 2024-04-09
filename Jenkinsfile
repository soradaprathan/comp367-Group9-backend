pipeline {
    agent any

    triggers {
        cron('H/5 * * * *') // Poll SCM every 5 minutes
    }

    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Checkout code') {
            steps {
                
                git branch: 'master', url: 'https://github.com/soradaprathan/comp367-Group9-backend.git'
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('sonar'){     
            steps {
                withSonarQubeEnv("SonarQube") {
                    bat "npm install sonar-scanner"
                    bat "npm run sonar"
                }
            }
        }

        stage('Build') {
            steps {
                bat 'npm install'      
            }
        }



        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("sorada1111/backend-dev:${env.BUILD_ID}")
                }
            }
        }

        // Further stages like 'Push Docker Image', 'Deploy to Dev', etc., can be added as needed
    }

    post {
        always {
           echo 'The pipeline is finished.'
        }
    }
}
