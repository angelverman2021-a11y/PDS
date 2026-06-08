import { getDataSourceDisclosure } from '../../services/dataSourceService';

export const DataSourceController = {
  disclosure() {
    return { status: 200, body: getDataSourceDisclosure() };
  },
};
