import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

type Message = { message: String; envs?: string };

type Data = Repository[] | Message;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const response = await axios.get<Repository[]>(
      `https://api.github.com/users/MauBoaventura/repos`,
    );

    const { status, data } = response;

    if (status !== 200 || !data) {
      res.status(500).json({
        message: `It wasn't possible to get the public repositories`,
      });

      return;
    }

    const favoriteRepositories = [
      'adrenalina-a-bordo',
      'basic_deploy_digitalocean',
      'bot-whats-agenda',
      'ConvertaX',
      'agendador-de-requisicoes',
      'adrenalina-a-bordo-react',
    ];

    const filteredRepositories = data.filter(({ name }: Repository) =>
      favoriteRepositories?.includes(name),
    );

    const sortedRepositories = filteredRepositories.sort(
      (a, b) => b.stargazers_count - a.stargazers_count,
    );
    res.status(200).json(sortedRepositories);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Server ERROR: ' + error, envs: process.env.NEXT_PUBLIC_BASE_URL });
  }
}
