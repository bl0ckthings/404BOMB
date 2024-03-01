import { initUseWagmiContracts, processTypechainAbis } from "@type_of/use-wagmi-contracts";
import * as typechain from '../protocol/typechain-types';
import { TST404 } from "../protocol/typechain-types";
const abiMap = processTypechainAbis(typechain 
    
);


const {WagmiContractsProvider, useContracts} = initUseWagmiContracts(abiMap);

export {WagmiContractsProvider, useContracts};