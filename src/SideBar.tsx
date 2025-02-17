import Icon from "@mui/material/Icon";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton"

import { styled } from "@mui/material/styles";
import { indigo, lightBlue, pink } from "@mui/material/colors";

import pjson from '../package.json';

type Props = {
    drawerOpen: boolean;
    onToggleDrawer: () => void;
    onFilter: (filter: Filter) => void;
};

const DrawerList = styled('div')(() => ({
    width: 250,
}));

const DrawerHeader = styled('div')(() => ({
    height: 150,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1em',
    backgroundColor: indigo[500],
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

const DrawerAvater = styled(Avatar)(({ theme }) => ({
    backgroundColor: pink[500],
    width: theme.spacing(6),
    height: theme.spacing(6),
}));


export const SideBar = (props: Props) => (
    <Drawer variant="temporary" open={props.drawerOpen} onClose={props.onToggleDrawer}>
        <DrawerList role="presentation" onClick={props.onToggleDrawer}>
            <DrawerHeader>
                <DrawerAvater>
                    <Icon>create</Icon>
                </DrawerAvater>
                <p>TODO v{pjson.version}</p>
            </DrawerHeader>
            <List>
                <ListItem disablePadding>
                    <ListItemButton aria-label="list-all" onClick={() => props.onFilter('all')}>
                    <ListItemIcon>
                        <Icon>subject</Icon>
                    </ListItemIcon>
                        <ListItemText secondary="全てのタスク" />
                    </ListItemButton>
                </ListItem>
            </List>
        </DrawerList>
    </Drawer>


    <select defaultValue="all" onChange={(e) => props.onFilter(e.target.value as Filter)}>
        <option value="all">全てのタスク</option>
        <option value="changed">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="removed">ゴミ箱</option>
    </select>
);