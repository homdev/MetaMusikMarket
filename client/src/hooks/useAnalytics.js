import { useContext } from 'react';
import AnalyticsContext from '../providers/analytics-context';

const useAnalytics = () => {
    return useContext(AnalyticsContext);
};

export default useAnalytics;
