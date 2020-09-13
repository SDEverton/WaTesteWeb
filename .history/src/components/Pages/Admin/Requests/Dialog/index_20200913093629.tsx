import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Slide from '@material-ui/core/Slide';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ErrorMessage from 'components/Shared/ErrorMessage';
import CheckboxField from 'components/Shared/Fields/Checkbox';
import TextField from 'components/Shared/Fields/Text';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import { useFormikObservable } from 'hooks/useFormikObservable';
import IRequests from 'interfaces/models/requests';
import React, { forwardRef, Fragment, memo, useCallback } from 'react';
import { useRetryableObservable } from 'react-use-observable';
import { tap } from 'rxjs/operators';
import userService from 'services/user';
import * as yup from 'yup';

interface IProps {
  opened: boolean;
  requests?: IRequests;
  onComplete: (requests: IRequests) => void;
  onCancel: () => void;
}

const validationSchema = yup.object().shape({
  description: yup.string().required().min(3).max(50),
  quantity: yup.number().required().min(3).max(10),
  price: yup.number().required().min(3).max(10)
});

const useStyle = makeStyles({
  content: {
    width: 600,
    maxWidth: 'calc(95vw - 50px)'
  },
  heading: {
    marginTop: 20,
    marginBottom: 10
  }
});

const FormDialogRequests = memo((props: IProps) => {
  const classes = useStyle(props);

  const formik = useFormikObservable<IRequests>({
    validationSchema
    onSubmit(model) {
      return userService.save(model).pipe(
        tap(user => {
          Toast.show(`${user.de} foi salvo${model.id ? '' : ', um email foi enviado com a senha'}`);
          props.onComplete(user);
        }),
        logError(true)
      );
    }
  });

  const [roles, rolesError, , retryRoles] = useRetryableObservable(() => {
    return userService.roles().pipe(logError());
  }, []);

  const handleEnter = useCallback(() => {
    formik.setValues(props.user ?? formik.initialValues, false);
  }, [formik, props.user]);

  const handleExit = useCallback(() => {
    formik.resetForm();
  }, [formik]);

  return (
    <Dialog
      open={props.opened}
      disableBackdropClick
      disableEscapeKeyDown
      onEnter={handleEnter}
      onExited={handleExit}
      TransitionComponent={Transition}
    >
      {formik.isSubmitting && <LinearProgress color='primary' />}

      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{formik.values.id ? 'Editar' : 'Novo'} Usuário</DialogTitle>
        <DialogContent className={classes.content}>
          {rolesError && <ErrorMessage error={rolesError} tryAgain={retryRoles} />}

          {!rolesError && (
            <Fragment>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label='Nome' name='firstName' formik={formik} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label='Sobrenome' name='lastName' formik={formik} />
                </Grid>
              </Grid>

              <TextField label='Email' name='email' type='email' formik={formik} />

              <FormControl component='fieldset' error={formik.touched.roles && !!formik.errors.roles}>
                <FormLabel component='legend'>Acesso</FormLabel>
                {formik.touched.roles && !!formik.errors.roles && (
                  <FormHelperText>{formik.errors.roles}</FormHelperText>
                )}
                <FormGroup>
                  {roles?.map(role => (
                    <CheckboxField
                      key={role.role}
                      name='roles'
                      label={role.name}
                      description={role.description}
                      value={role.role}
                      isMultiple
                      formik={formik}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Fragment>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel}>Cancelar</Button>
          <Button color='primary' variant='contained' type='submit' disabled={formik.isSubmitting || !roles}>
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});

const Transition = memo(
  forwardRef((props: any, ref: any) => {
    return <Slide direction='up' {...props} ref={ref} />;
  })
);

export default FormDialogRequests;
