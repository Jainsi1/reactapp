import Widget from "../../../../../../components/Widget";
import { Avatar, Col, Row, Tooltip } from "antd";
import { collect } from "collect.js";
import { Link } from "react-router-dom";

const QbrSummary = (props) => {
  const { loading, error, trends, title } = props;

  const getSummaryForQuarters = () => {
    const [currentTrend, oldTrend] = trends.slice(-2)
    console.log({ currentTrend, oldTrend })
    const headers = currentTrend.headers

    let data = []

    for (let header of headers) {
      let users = []

      const currentBar = currentTrend?.bars
        ?.find(e => e.name == header.toUpperCase());
      const previousBar = oldTrend?.bars
        ?.find(e => e.name == header.toUpperCase());

      const currentBarContribution = currentBar?.contribution || 0
      const previousBarContribution = previousBar?.contribution || 0

      const newUsers = [...currentBar?.users || [], ...previousBar?.users || []]

      if (newUsers.length) {
        users = collect(newUsers).unique('id').toArray()
      }

      const diff = currentBarContribution - previousBarContribution
      const isImproved = diff > -1 ? "Improved" : "Drop";

      let text = `${isImproved} by ${diff}% QoQ. ${currentBarContribution}% in ${currentTrend.name} vs ${previousBarContribution}% in ${oldTrend.name}`
      data.push({
        users,
        name: header,
        text
      })
    }
    return data
  }

  if (loading) return (
    <Widget className="dashboard-card-widget dashboard-card-loading">
      <h1 className="dashboard-card-text">LOADING {title}...</h1>
    </Widget>
  );

  if (error) return (
    <Widget className="dashboard-card-widget dashboard-card-loading">
      <h1 className="dashboard-card-text">Error :(</h1>
    </Widget>
  );

  return (
    <Widget className="dashboard-card-widget" style={{ height: "100%" }}>
      <Row className="dashboard-card-top-row">
        <Col>
          <h1 className="dashboard-card-text">{title}</h1>
        </Col>

        <Col xl={24} style={{ marginTop: "1rem" }}>
          {trends.length < 2 ?
            <p>Not enough data</p>
            :
            <div style={{ overflow: "scroll" }}>
              {getSummaryForQuarters().map((item, i) => (
                <Row key={i} className={"mt-2"}>
                  <Col xl={5} className={"flex items-center"}>
                    <Avatar.Group
                      maxCount={2}
                      maxPopoverTrigger="click"
                      size="large"
                      maxStyle={{
                        color: '#f56a00',
                        backgroundColor: '#fde3cf',
                        cursor: 'pointer',
                      }}
                    >
                      {item.users?.map((user) => (
                        <>
                          <Tooltip key={user.id} title={user.firstName + " " + user.lastName}>
                            <Link to={"/user-profile/" + user.id}>
                              <Avatar
                                className={"cursor-pointer"}
                                src={user.image}/>
                            </Link>
                          </Tooltip>
                        </>
                      ))}
                    </Avatar.Group>
                  </Col>
                  <Col xl={4} className={"text-center flex items-center justify-center"}>
                      <span className={"summary-heading"}>
                        {item.name}
                      </span>
                  </Col>
                  <Col xl={15} className={"text-center flex items-center justify-center"}>
                      <span className={"summary-paragraph"}>
                        {item.text}
                      </span>
                  </Col>
                </Row>
              ))}
            </div>
          }

        </Col>
      </Row>
    </Widget>
  )
}

export default QbrSummary