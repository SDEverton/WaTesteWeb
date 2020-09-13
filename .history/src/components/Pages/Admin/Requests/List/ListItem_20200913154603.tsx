import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Alert from 'components/Shared/Alert';
import { IOption } from 'components/Shared/DropdownMenu';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import IRequests from 'interfaces/models/requests';
import DeleteIcon from 'mdi-react/DeleteIcon';
import EditIcon from 'mdi-react/EditIcon';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useCallbackObservable } from 'react-use-observable';
import { from } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import requestsService from 'services/requests';

interface IProps {
  requests: IRequests;
  onEdit: (requests: IRequests) => void;
  onDeleteComplete: () => void;
}

const ListRequests = memo((props: IProps) => {
  const { requests, onEdit, onDeleteComplete } = props;

  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleDismissError = useCallback(() => setError(null), []);

  const handleEdit = useCallback(() => {
    onEdit(requests);
  }, [onEdit, requests]);

  const [handleDelete] = useCallbackObservable(() => {
    return from(Alert.confirm(`Deseja excluir o usuário ${requests.description}?`)).pipe(
      filter(ok => ok),
      tap(() => setLoading(true)),
      switchMap(() => requestsService.delete(requests.id)),
      logError(),
      tap(
        () => {
          Toast.show(`${requests.description} foi removido`);
          setLoading(true);
          setDeleted(true);
          onDeleteComplete();
        },
        error => {
          setLoading(false);
          setError(error);
        }
      )
    );
  }, []);

  const options = useMemo<IOption[]>(() => {
    return [
      { text: 'Editar', icon: EditIcon, handler: handleEdit },
      { text: 'Excluir', icon: DeleteIcon, handler: handleDelete }
    ];
  }, [handleDelete, handleEdit]);

  if (deleted) {
    return null;
  }

  const priceFormated = (params: IRequests) => {
    return params.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }});

  return (
    <TableRow>
      <TableCell>{requests.description}</TableCell>
      <TableCell>{requests.quantity}</TableCell>
      <TableCell>{priceFormated(requests.price)}</TableCell>
      <TableCellActions options={options} loading={loading} error={error} onDismissError={handleDismissError} />
    </TableRow>
  );
});

export default ListRequests;
