import { hardwarePosts } from '../data/blog/hardware';
import { softwarePosts } from '../data/blog/software';
import { protocolsPosts } from '../data/blog/protocols';
import { engineeringPosts } from '../data/blog/engineering';
import { cicdPosts } from '../data/blog/cicd';
import { aiPosts } from '../data/blog/ai';

export const blogPosts = [
  ...hardwarePosts,
  ...softwarePosts,
  ...protocolsPosts,
  ...engineeringPosts,
  ...cicdPosts,
  ...aiPosts
].sort((a, b) => a.id - b.id);
