import React, { useContext } from "react";
// import { makeStyles } from '@material-ui/core/styles';

// import {
//   FormGroup,
//   RadioGroup
// } from '@material-ui/core';

// import { useHistory } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";
// import { AuthContext } from "../../contexts/AuthContext";

import {
  TextField,
  // Checkbox, Radio,
  Button,
  DialogContent,
  DialogActions,
} from "../../components/common";
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: '100%',
//     padding: theme.spacing(3),
//     position: 'relative'
//   },
//   paper: {
//     width: '100%',
//     marginTop: theme.spacing(2),
//     marginBottom: theme.spacing(2),
//   },
//   actions: {
//     position: 'absolute',
//     left: 20,
//     bottom: 20,
//     '& svg': {
//       color: theme.palette.layout.color,
//     }
//   },
//   content: {
//     width: 700,
//     backgroundColor: theme.palette.dialog.background,
//     color: theme.palette.dialog.color,
//   },
//   info: {
//     display: 'flex',
//     width: '100%',
//     alignItems: 'center',
//     height: 45,
//     '& > *:first-child': {
//       flexBasis: '25%'
//     },
//     '& > *:not(:first-child)': {
//       flexBasis: '74%'
//     },
//   },
// }));

export default ({
  onConfirm = () => { },
}) => {
  const { closeDialog, authedApi, t } = useContext(GlobalContext);

  const [state, setState] = React.useState({ number: "", description: "", consumer_accountid: "" })
  const [accountList, setAccountList] = React.useState([]);

  React.useEffect(() => {
    getAccountList()
  }, [])

  const getAccountList = async () => {
    const { result } = await authedApi.getAccountList({
      data: {
        roleid: [2, 3]
      },
      limit: 50,
      page: 1
    })
    let _accountList = result.map(p => ({ ...p, _id: p.accountid }))
    setAccountList(_accountList)
  }

  return (
    <>
      <DialogContent
        style={{ width: 500 }}
        dividers>
        <TextField
          type="number"
          label={t("amount")}
          fullWidth
          style={{ marginBottom: 20 }}
          value={state.number}
          onChange={e => setState({ ...state, number: Number(e.target.value) })}
        />
        <TextField
          type="text"
          label={t("description")}
          fullWidth
          style={{ marginBottom: 20 }}
          value={state.description}
          onChange={e => setState({ ...state, description: e.target.value })}
        />
        <FormControl
          fullWidth
          style={{ marginBottom: 20 }}>
          <InputLabel>{t("consumer")}</InputLabel>
          <Select
            value={state.consumer_accountid}
            onChange={e => setState({ ...state, consumer_accountid: Number(e.target.value) })}
          >
            {
              accountList.map(a => <MenuItem key={a.accountid} value={a.accountid}>{a.name}</MenuItem>)
            }
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>
          Cancel
        </Button>
        <Button onClick={() => onConfirm(state)}>
          Generate
        </Button>
      </DialogActions>
    </>
  )
}