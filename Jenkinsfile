pipeline {
    agent any

    triggers {
        cron('H/5 * * * *') // Poll SCM every 5 minutes
    }

    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Replace with your specific branch if needed
                git 'https://github.com/soradaprathan/comp367-Group9-backend.git'
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Static Code Analysis') {
            steps {
                script {
                    withSonarQubeEnv('YourSonarQubeServer') {
                        sh 'sonar-scanner -Dsonar.projectKey=YourProjectKey -Dsonar.sources=. -Dsonar.host.url=YourSonarServerUrl -Dsonar.login=YourSonarAuthToken'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("your-image-name:${env.BUILD_ID}")
                }
            }
        }

        // Further stages like 'Push Docker Image', 'Deploy to Dev', etc., can be added as needed
    }

    post {
        always {
            // Post-build actions like cleaning up can go here
        }
    }
}
