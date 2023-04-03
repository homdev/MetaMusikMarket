import { useContext } from 'react';
import MarketplaceContext from '../providers/marketplace-context';

const useMarketplace = () => {
    return useContext(MarketplaceContext);
};

export default useMarketplace;
