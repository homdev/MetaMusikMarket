import { useContext } from 'react';
import CollectionContext from '../providers/collection-context';

const useCollection = () => {
    return useContext(CollectionContext);
};

export default useCollection;
