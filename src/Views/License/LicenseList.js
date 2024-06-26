import React, { useContext } from "react";
import { GlobalContext } from "../../contexts/GlobalContext";
import { AuthContext } from "../../contexts/AuthContext";
import { Table, Paper } from "../../components/common";
import { useHistory } from "react-router-dom";

import {
  BorderColorSharp,
  Delete,
  AddBox,
} from '@material-ui/icons';
import { licenselist } from "../../utils/constant";

const LicenseList = () => {
  const { t } = useContext(GlobalContext);
  const { role } = useContext(AuthContext);
  const history = useHistory();
  return (
    <Paper>
      <Table
        title={t("thing-list", { thing: t("license") })}
        rows={licenselist}
        columns={[
          { key: 'name', label: t('name') },
          { key: 'description', label: t('description') },
          { key: 'duration', label: t('duration') },
          { key: 'cost', label: t('cost') },
        ]}
        checkable={role === 1}
        order="asc"
        orderBy="name"
        onPageChange={(event, page) => console.log(page)}
        onRowsPerPageChange={(event) => console.log(parseInt(event.target.value, 10))}
        onSortChange={(isAsc, property) => console.log(isAsc, property)}
        onKeywordSearch={(event) => console.log(event.target.value)}
        toolbarActions={role === 1 ? [
          { name: t('add'), onClick: () => { }, icon: <AddBox /> },
        ] : []}
        rowActions={role === 1 ? [
          { name: t('edit'), onClick: (e, row) => { history.push(`/licenseitem/${row._id}`) }, icon: <BorderColorSharp /> },
          { name: t('delete'), onClick: (e, row) => console.log(row), icon: <Delete /> }
        ] : []}
      // dense
      />
    </Paper>
  );
}


export default LicenseList;