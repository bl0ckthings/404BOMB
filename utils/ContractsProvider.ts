import { initUseWagmiContracts, processTypechainAbis } from "@type_of/use-wagmi-contracts";
import * as typechain from '../protocol/typechain-types';

const abiMap = processTypechainAbis(typechain, {
    TST404: '0xE4855B974c59d10384eF4400ac8ffF55C283143a'
});


const {WagmiContractsProvider, useContracts} = initUseWagmiContracts(abiMap);

export {WagmiContractsProvider, useContracts};