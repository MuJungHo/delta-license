import React, { useContext } from "react";
import { GlobalContext } from "../../contexts/GlobalContext";
// import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
// import FilterListIcon from '@material-ui/icons/FilterList';
import { Checkbox, Actions, TextField } from "../common";
import { DateRangePicker, CustomProvider } from 'rsuite';
import moment from "moment";

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    sort,
    numSelected,
    rowCount,
    rowActions,
    onRequestSort,
    columns,
    checkable
  } = props;

  const { t } = useContext(GlobalContext);

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {checkable && <TableCell padding="checkbox">
          <Checkbox
            color="secondary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>}
        {columns.map((column) => (
          <TableCell
            key={column.key}
            align="left"
            padding="normal"
            sortDirection={sort === column.key ? order : false}
          >
            <TableSortLabel
              active={sort === column.key}
              direction={sort === column.key ? order : 'asc'}
              onClick={createSortHandler(column.key)}
            >
              {column.label}
              {sort === column.key ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {rowActions.length > 0 && <TableCell align="center">
          {t('action')}
        </TableCell>}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { t } = useContext(GlobalContext);
  const {
    numSelected,
    onDateRangeChange,
    title, toolbarActions, onKeywordSearch, dateRangePicker } = props;
  const nowDateTime = moment().unix() * 1000;
  const [keyword, setKeyword] = React.useState("")
  const onKeywordChange = (e) => {
    setKeyword(e.target.value)
    onKeywordSearch(e.target.value)
  }
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (<Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        {title}
      </Typography>)}
      {dateRangePicker && <DateRangePicker
        format="yyyy-MM-dd HH:mm:ss"
        locale={t("daterangepicker")}
        cleanable={false}
        // value={[new Date(nowDateStartTime), new Date(nowDateEndTime)]}
        defaultValue={[new Date(nowDateTime), new Date(nowDateTime)]}
        onChange={onDateRangeChange} />}

      {numSelected === 0 && <TextField
        type="search"
        size="small"
        value={keyword}
        onChange={onKeywordChange} />}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        toolbarActions.length > 0 && <Actions actions={toolbarActions} />
      )}
    </Toolbar>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
    '& .MuiTableCell-root': {
      color: theme.palette.table.color
    },
    '& .MuiTableSortLabel-root:hover': {
      color: theme.palette.table.color
    },
    '& .MuiTableSortLabel-root.MuiTableSortLabel-active': {
      color: theme.palette.table.color
    },
    '& .MuiTableSortLabel-root.MuiTableSortLabel-active.MuiTableSortLabel-root.MuiTableSortLabel-active .MuiTableSortLabel-icon': {
      color: theme.palette.table.color
    }
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  pagination: {
    color: theme.palette.pagination.color,
    '& .MuiSelect-icon': {
      color: theme.palette.pagination.color,
    },
    '& .MuiIconButton-root.Mui-disabled': {
      color: theme.palette.pagination.disabled
    }
  },
}));

export default ({
  dense = false,
  checkable = true,
  dateRangePicker = false,
  onRowsPerPageChange = () => { },
  onPageChange = () => { },
  onKeywordSearch = () => { },
  onDateRangeChange = () => { },
  rows = [],
  columns = [],
  onSortChange = () => { },
  rowActions = [],
  toolbarActions = [],
  sort = "",
  order = "asc",
  title = "",
  total = 0
}) => {
  const classes = useStyles();
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const { theme } = useContext(GlobalContext);

  const handleRequestSort = (event, property) => {
    const isAsc = sort === property && order === 'asc';
    onSortChange(isAsc ? 'desc' : 'asc', property)
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, _id) => {
    if (!checkable) return;
    const selectedIndex = selected.indexOf(_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (_id) => selected.indexOf(_id) !== -1;

  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
    onPageChange(newPage + 1)
  }

  const handleChangeRowPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
    onRowsPerPageChange(parseInt(event.target.value, 10))
  }

  return (
    <div className={classes.root}>
      <CustomProvider theme={theme ? "dark" : "light"}>
        <EnhancedTableToolbar
          title={title}
          numSelected={selected.length}
          toolbarActions={toolbarActions}
          onKeywordSearch={onKeywordSearch}
          dateRangePicker={dateRangePicker}
          onDateRangeChange={onDateRangeChange}
        />
        <TableContainer>
          <Table
            className={classes.table}
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              sort={sort}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              rowActions={rowActions}
              columns={columns}
              checkable={checkable}
            />
            <TableBody>
              {rows.map((row, index) => {
                const isItemSelected = isSelected(row._id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row._id)}
                    tabIndex={-1}
                    key={row._id}
                    selected={isItemSelected}
                  >
                    {checkable && <TableCell padding="checkbox">
                      <Checkbox
                        color="secondary"
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>}
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        align="left"
                      >
                        {row[column.key] || "--"}
                      </TableCell>
                    ))}

                    {rowActions.length > 0 && <TableCell align="center">
                      <Actions actions={rowActions} row={row} />
                    </TableCell>}
                  </TableRow>
                );
              })}
              {/* {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          className={classes.pagination}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowPerPage}
        />
      </CustomProvider>
    </div>
  );
}