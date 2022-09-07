import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { map, each, every, find, isEqual } from "lodash";
import { Alert, Button, Table, Container } from "react-bootstrap";

import URLConfig from "../URLConfig";
import "./serverMonitor.css";

const URLs = [
  {
    id: 1,
    name: "SOW SFDC API",
    url: URLConfig.get_CustomerCapsule_API_Host(),
    config: URLConfig.getSOWSFDCUrl("OPP-0003838490"),
  },
  {
    id: 2,
    name: "SOW API",
    url: URLConfig.getURLDeltaSOWAPI(),
    config: {
      method: "get",
      url: URLConfig.getURLDeltaSOWAPI() + "SOW/GetSOWStatus",
    },
  },
  {
    id: 3,
    name: "SOW E3T API",
    url: URLConfig.getURLDeltaSOWAPI(),
    config: {
      method: "get",
      url: URLConfig.getURLDeltaSOWAPI() + "SOWE3T/GetSOWE3TStatus",
    },
  },
  {
    id: 4,
    name: "SOW GemBox API",
    url: URLConfig.getURLDocDepoSOWAPI(),
    config: {
      method: "get",
      url: URLConfig.getURLDocDepoSOWAPI() + "SOWGemBox/GetSOWGemBoxStatus",
    },
  },
];

const ServerStatus = {
  UP: {
    status: "up",
    color: "green",
  },
  DOWN: {
    status: "down",
    color: "red",
  },
};

const ServerMonitor = () => {
  const [serverStatus, setServerStatus] = useState(
    map(URLs, (item) => ({ ...item, ...ServerStatus["DOWN"], loader: false }))
  );
  const [serverFlag, setServerFlag] = useState(true);
  const prevServerState = useRef(null);

  useEffect(() => {
    checkServerHealth();
  }, []);

  useEffect(() => {
    prevServerState.current = serverStatus;
    setServerFlag(every(serverStatus, (item) => item.status));
  }, [serverStatus]);

  const setServerStateOnlyIfValueChanged = (id, currentValue) => {
    if (
      !isEqual(
        find(prevServerState?.current, (item) => item?.id === id)?.status,
        currentValue
      )
    ) {
      setServerStatus((prevServerState) => {
        const newServerState = map(prevServerState, (item) => {
          if (item?.id === id) {
            return { ...item, ...currentValue };
          }
          return { ...item };
        });
        return newServerState;
      });
    }
  };

  const checkServerHealth = () => {
    each(URLs, (item) => {
      runRequest(item);
    });
  };

  const runRequest = async (item) => {
    try {
      const res = await axios(item?.config);
      if (res?.status === 200) {
        setServerStateOnlyIfValueChanged(item?.id, ServerStatus["UP"]);
      } else {
        setServerStateOnlyIfValueChanged(item?.id, ServerStatus["DOWN"]);
      }
    } catch (error) {
      setServerStateOnlyIfValueChanged(item?.id, ServerStatus["DOWN"]);
    }
  };

  console.log(serverStatus);

  return (
    <Container fluid>
      <div className="monitor-page-layout">
        <div className="empty" />
        <div>
          <h2>Server Monitor</h2>

          {every(serverStatus, (item) => item.status === "up") ? (
            <Alert variant="success">All APIs Operational</Alert>
          ) : (
            <Alert variant="danger">All APIs Not Operational</Alert>
          )}

          <Button variant="primary" onClick={() => checkServerHealth()}>
            Refresh
          </Button>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>API Name</th>
                <th>URL</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {map(serverStatus, (item) => (
                <tr key={item?.id}>
                  <td>{item?.id}</td>
                  <td>{item?.name}</td>
                  <td>{item?.url}</td>
                  <td>
                    <i
                      className={`fas fa-arrow-alt-circle-${item?.status} fa-2x`}
                      style={{ color: item?.color }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="empty" />
      </div>
    </Container>
  );
};

export default ServerMonitor;
