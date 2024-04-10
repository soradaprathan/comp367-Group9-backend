pipeline {
    agent any

    // triggers {
    //     cron('H/5 * * * *') // Poll SCM every 5 minutes
    // }

    tools {
        nodejs 'NodeJS'
    }

    environment {     
        IMAGE_NAME = "sorada1111/backend-dev:lastest"
        IMAGE_NAME_VERSION = "sorada1111/backend-dev:${BUILD_ID}"
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
            script {
                
                def scannerHome = tool 'SonarQube';
                withSonarQubeEnv('SonarQube') {
                    bat "${scannerHome}/bin/sonar-scanner"
                }
            }
        }
    }

 stage('Test and Coverage') {
            steps {
                script {
                    // Install project dependencies
                    bat 'npm install'
                    // Run Jest tests with coverage. It will not fail if there are no tests, due to Jest configuration.
                    bat 'npm test'
                }
                //cobertura coberturaReportFile: '**/coverage/lcov.info'
            }
        }
    stage('Docker Build') {
            steps {
               script {                  
                    bat "docker build -t ${IMAGE_NAME_VERSION} ."                   
                }
            }
        }
        
        stage('Docker Login') {
            steps {
               script {    
                      withCredentials([usernamePassword(credentialsId: 'dockerhubtoken', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                      bat "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                      }
                }
            }
        }
        
        stage('Docker Push') {
            steps {
                script {
                    bat "docker tag ${IMAGE_NAME_VERSION} ${IMAGE_NAME}"
                    bat "docker push ${IMAGE_NAME}"
                    bat "docker push ${IMAGE_NAME_VERSION}"
                    // bat "docker tag ${IMAGE_NAME_VERSION} sorada1111/backend-dev:latest"
                    // bat "docker push sorada1111/backend-dev:latest"
                    // bat "docker push ${IMAGE_NAME_VERSION}"
                }
            //    script {
            //          bat "docker tag ${IMAGE_NAME_VERSION} ${IMAGE_NAME}"
            //          bat "docker push ${IMAGE_NAME}"
            //          bat "docker push ${IMAGE_NAME_VERSION}"
            //     }
            }
        }



    }

    post {
        always {
           echo 'The pipeline is finished.'
        }
    }
}
