import { useContext } from 'react';
import AuctionsContext from '../providers/auction-context';

const useAuctions = () => {
    return useContext(AuctionsContext);
};

export default useAuctions;
