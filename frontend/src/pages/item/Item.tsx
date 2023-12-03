import { useContext } from 'react';
import { Context } from '../..';
import ItemAdmin from '../../components/itemAdmin/ItemAdmin';
import ItemUser from '../../components/itemUser/ItemUser';
import { Role } from '../../utils/types';

export default function Item() {
	const userStore = useContext(Context).user;
	return userStore.user.role === Role.ADMIN ? <ItemAdmin /> : <ItemUser />;
}
