import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem } from '@patternfly/react-core';
import GrafanaUrl from './GrafanaUrl';
import Definition from '../../components/Definition';
import Roles from './Roles';

function Namespace({ namespace, roles }) {
  function matches(r) {
    const a = r.access;
    if (a === null) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (
        a[i] !== undefined &&
        a[i].namespace &&
        a[i].namespace.name === namespace.name &&
        a[i].namespace.cluster.name === namespace.cluster.name
      ) {
        return true;
      }
    }
    return false;
  }
  const matchedData = roles.filter(matches);
  const grafana = (
    <GrafanaUrl
      jumpHost={namespace.cluster.jumpHost}
      cluster={namespace.cluster.name}
      namespace={namespace.name}
      url={namespace.grafanaUrl}
      hide={false}
    />
  );
  function resourceName(r) {
    if (r.output_resource_name) {
      return r.output_resource_name;
    }
    return `${r.identifier}-${r.provider}`;
  }
  const listItems =
    namespace.managedTerraformResources &&
    namespace.terraformResources.map(a => (
      <ListItem>
        <a
          href={`https://console.${namespace.cluster.name}.openshift.com/console/project/${
            namespace.name
          }/browse/secrets/${resourceName(a)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {a.provider} - {a.identifier}
        </a>
      </ListItem>
    ));
  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Name', namespace.name],
          [
            'Path',
            <a href={`${window.DATA_DIR_URL}${namespace.path}`} target="_blank" rel="noopener noreferrer">
              {namespace.path}
            </a>
          ],
          [
            'Cluster',
            <Link
              to={{
                pathname: '/clusters',
                hash: namespace.cluster.path
              }}
            >
              {namespace.cluster.name}
            </Link>
          ],
          ['Grafana', grafana]
        ]}
      />

      <h4>Description</h4>
      {namespace.description}

      {matchedData.length > 0 && (
        <React.Fragment>
          <h4> Roles </h4>
          <Roles roles={matchedData} />
        </React.Fragment>
      )}
      {listItems && (
        <React.Fragment>
          <h4> Terraform resources </h4>
          <List className="policyList">{listItems}</List>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default Namespace;
