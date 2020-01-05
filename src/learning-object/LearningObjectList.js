import React, { Fragment } from 'react';
import { List, EditButton, ShowButton, TextInput, Filter, SelectInput, useTranslate, ReferenceInput, FormDataConsumer } from 'react-admin';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { useForm } from 'react-final-form';
import decodeJwt from 'jwt-decode';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  card: {
    width: 400,
    margin: '0.5em',
    display: 'inline-block'
  },
  cardActions: {
    textAlign: 'right',
  },

  deleted: {
    border: 'solid red'
  }
});


const LearningObjectGrid = ({ permissions, user, ids, data, basePath }) => {
  const classes = useStyles();
  return <div>
    {ids.map((id, i) => (
      <Card key={i} className={data[id].deleted ? classes.deleted : classes.card}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {data[id].metadata && data[id].metadata.general && data[id].metadata.general.title}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {data[id].created}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {data[id].metadata && data[id].metadata.general && data[id].metadata.general.description}
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          {(data[id].creator_id === user._id || user.role === 'administrator') && (
            <EditButton
              resource="learning-object-collection"
              basePath={basePath}
              record={data[id]}
              permissions={permissions}
            />
          )}
          <ShowButton resource="learning-object-collection" basePath={basePath} record={data[id]} />
        </CardActions>
      </Card>
    ))}
  </div>
};

LearningObjectGrid.defaultProps = {
  data: {},
  ids: [],
};
const CollectionPicker = ({ formData, classes, resource, ...rest }) => {
  const form = useForm()
  return (
    <Fragment>
      <ReferenceInput
        label="Colección"
        resource={resource}
        source='collection_id'
        reference='collection'
        onChange={value => form.change('sub_collection_id', null)}
        allowEmpty>
        <SelectInput optionText='name' />
      </ReferenceInput>
    </Fragment>
  );
}
const LearningObjectFilter = ({ permissions, user, ...props }) => {
  const translate = useTranslate();
  return <Filter {...props}>
    <TextInput label={translate('lo.search')} id="inputSearchLo" style={{ width: 225 }} source="q" alwaysOn />
    <FormDataConsumer form={'filterForm'} source='collection_id' alwaysOn>
      {formDataProps => <CollectionPicker {...formDataProps} />}
    </FormDataConsumer>
    {(props.filterValues.collection_id) && (
      <ReferenceInput
        label="Subcolección"
        key={props.filterValues.collection_id}
        source='sub_collection_id'
        reference='subcollection'
        filter={{ _id: props.filterValues.collection_id }}>
        <SelectInput  optionText='name' />
      </ReferenceInput>
    )}

    {permissions === 'administrator' && (
      <SelectInput
        alwaysOn
        label={translate('lo.advanced_filters')}
        source="advanced_filters"
        optionValue="filter"
        choices={[
          { id: 0, filter: { status: 'pending' }, name: 'lo.filters.pending' },
          { id: 1, filter: { status: 'evaluated' }, name: 'lo.filters.evaluated' },
          { id: 2, filter: { status: 'accepted' }, name: 'lo.filters.accepted' },
          { id: 3, filter: { status: 'rejected' }, name: 'lo.filters.rejected' },
          { id: 4, filter: { deleted: true }, name: 'lo.filters.deleted' },
          { id: 5, filter: { creator_id: user._id }, name: 'lo.filters.created_for_me' },
        ]}
      />
    )}
    {permissions === 'expert' && (
      <SelectInput
        alwaysOn
        label={translate('lo.advanced_filters')}
        source="advanced_filters"
        optionValue="filter"
        choices={[
          { id: 0, filter: {}, name: 'lo.filters.all' },
          { id: 1, filter: { expert_ids: user._id }, name: 'lo.filters.assigned_to_me' },
          { id: 2, filter: { creator_id: user._id }, name: 'lo.filters.created_for_me' },
        ]}
      />
    )}
    {permissions === 'creator' && (
      <SelectInput
        alwaysOn
        label={translate('lo.advanced_filters')}
        source="advanced_filters"
        optionValue="filter"
        choices={[
          { id: 0, filter: {}, name: 'lo.filters.all' },
          { id: 1, filter: { creator_id: user._id }, name: 'lo.filters.created_for_me' },
        ]}
      />
    )}
  </Filter>
};

const LearningObjectList = ({ permissions, ...props }) => {
  const translate = useTranslate();
  return <Fragment><List
    {...props}
    title={translate('lo.all')}
    filters={
      <LearningObjectFilter
        permissions={permissions}
        user={decodeJwt(localStorage.getItem('token'))}
      />
    }
  >
    <LearningObjectGrid user={decodeJwt(localStorage.getItem('token'))} permissions={permissions} />
  </List>
  </Fragment>
};

export default LearningObjectList;
