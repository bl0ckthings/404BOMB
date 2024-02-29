import { defineConfig } from '@wagmi/cli'
import { etherscan, react } from '@wagmi/cli/plugins'
import { erc20Abi } from 'viem'
import { blastSepolia } from 'wagmi/chains'
 
export default defineConfig({
  out: 'src/generated.ts',
  contracts: [
    {
      name: 'erc20',
      abi: erc20Abi,
    },
  ],
  plugins: [
    etherscan({
      apiKey: 'blast_sepolia',
      chainId: 168587773,
      contracts: [
        {
          name: '404TST',
          address: {

            [blastSepolia.id]: '0xE4855B974c59d10384eF4400ac8ffF55C283143a',
          },
        },
      ],
    }),
    react(),
  ],
})