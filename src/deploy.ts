import axios from 'axios';
import simpleGit from 'simple-git';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const inquirer = require('inquirer');






dotenv.config();
async function getTokens() {
  const envFilePath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
  } else {
    console.log('Please add your GitHub and Vercel tokens to the .env file:');
    console.log('GITHUB_TOKEN=your_github_token_here');
    console.log('VERCEL_TOKEN=your_vercel_token_here');
    process.exit(1); 
  }
  
  return {
    githubToken: process.env.GITHUB_TOKEN,
    vercelToken: process.env.VERCEL_TOKEN,
  };
}


async function promptUser() {
  const questions = [
    {
      type: 'input',
      name: 'repoName',
      message: 'Enter the name of the GitHub repository:',
    },
    {
      type: 'input',
      name: 'projectPath',
      message: 'Enter the path to your project:',
      default: '.',
    },
  ];

  return inquirer.prompt(questions);
}


async function createGitHubRepo(repoName: string) {
  const { githubToken } = await getTokens();
  const response = await axios.post(
    'https://api.github.com/user/repos',
    {
      name: repoName,
    },
    {
      headers: {
        Authorization: `token ${githubToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.clone_url;
}


async function pushToGitHub(repoUrl: string, projectPath: string) {
  const git = simpleGit(projectPath);
  await git.init();
  await git.addRemote('origin', repoUrl);
  await git.add('.');
  await git.commit('Initial commit');
  await git.push('origin', 'main');
}


async function deployToVercel(projectPath: string) {
  const { vercelToken } = await getTokens();
  execSync(`npx vercel --prod --token ${vercelToken}`, { cwd: projectPath, stdio: 'inherit' });
}


export async function deploy() {
  try {
    const { repoName, projectPath } = await promptUser();

    console.log('Creating GitHub repository...');
    const repoUrl = await createGitHubRepo(repoName);
    console.log(`Repository created at ${repoUrl}`);

    console.log('Pushing code to GitHub...');
    await pushToGitHub(repoUrl, projectPath);
    console.log('Code pushed to GitHub');

    console.log('Deploying to Vercel...');
    await deployToVercel(projectPath);
    console.log('Deployment complete');
  } catch (error:any) {
    console.error('Error:', error.message);
  }
}
