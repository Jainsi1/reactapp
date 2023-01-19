import { Col, Row } from "antd";
import { Tree, TreeNode } from 'react-organizational-chart';

import graphImg from "assets/images/graph-img.svg"
import graphImg1 from "assets/images/graph-img1.svg"

export default function Graph() {
  return (
    <>
      <div>
        <Row>
          <Col span={24}>
            <Tree
              lineWidth={'1px'}
              lineColor={'#DDDDDD'}
              lineBorderRadius={'1px'}
              label={<div className='styled-node-main'>Board Of Directors </div>}
              className='tree-srm'
            >
              <TreeNode label={<div className='styled-node-child'>SVP Participation</div>}>
                <TreeNode label={<div className='styled-node-child'>SVP Participation</div>}>
                  <TreeNode
                    lineHeight={200}
                    label={
                      <div className='styled-node'>
                        <Row>
                          <Col span={8} className='col-node'>
                            <img src={graphImg} alt="img" width="50" height="50" className='img-node'></img>
                          </Col>
                          <Col span={16} className='col-node col-node-text' >
                            <span className='p-node'><b>Mark Davis</b></span>
                            <span className='point-node'>CEO & President</span>
                          </Col>
                        </Row>
                      </div>
                    }>
                    {/* <TreeNode label={<div className='styled-node-child'>SVP Quality Assurance</div>}>
                      <TreeNode label={<div className='styled-node-child'>SVP Security</div>} >
                        <TreeNode label={<div className='styled-node-child'>SVP Technical</div>} >
                          <TreeNode label={<div className='styled-node-child'>SVP Media Relations</div>} >
                            <TreeNode label={<div className='styled-node-child'>SVP Inspection Board</div>} >
                              <TreeNode label={<div className='styled-node-child'>SVP Flight Training</div>} >
                                <TreeNode label={<div className='styled-node-child'>SVP Legal </div>} >
                                  <TreeNode label={<div className='styled-node-child'>SVP Corporate Satisfaction</div>} >

                                  </TreeNode>
                                </TreeNode>
                              </TreeNode>
                            </TreeNode>
                          </TreeNode>
                        </TreeNode>
                      </TreeNode>
                    </TreeNode> */}
                    <TreeNode label={
                      <div className='styled-node'>
                        <Row>
                          <Col span={8} className='col-node'>
                            <img src={graphImg1} alt="img" width="50" height="50" className='img-node'></img>
                          </Col>
                          <Col span={16} className='col-node col-node-text' >
                            <span className='p-node'><b>Nicole jay</b></span>
                            <span className='point-node'>Chief Human Resources  Officer</span>
                          </Col>
                        </Row>
                      </div>
                    }>
                      <TreeNode label={<div className='styled-node-child'>SVP Personal Management</div>} >
                        <TreeNode label={<div className='styled-node-child'>SVP Human Resources</div>} >
                          <TreeNode label={<div className='styled-node-child'>SVP Training</div>} >
                            <TreeNode label={<div className='styled-node-child'>SVP Social and Administrative Affairs</div>} >
                              <TreeNode label={<div className='styled-node-child'>SVP Crew Planning</div>} >
                              </TreeNode>
                            </TreeNode>
                          </TreeNode>
                        </TreeNode>
                      </TreeNode>
                    </TreeNode>
                    <TreeNode label={
                      <div className='styled-node'>
                        <Row>
                          <Col span={8} className='col-node'>
                            <img src={graphImg} alt="img" width="50" height="50" className='img-node'></img>
                          </Col>
                          <Col span={16} className='col-node col-node-text' >
                            <span className='p-node'><b>David  Banks</b></span>
                            <span className='point-node'>Chief Financial officer</span>
                          </Col>
                        </Row>
                      </div>
                    }>
                      <TreeNode label={<div className='styled-node-child'>SVP Finance</div>} >
                        <TreeNode label={<div className='styled-node-child'>SVP Accounting and Financial Control</div>} >
                          <TreeNode label={<div className='styled-node-child'>SVP General Purchasing</div>} >

                          </TreeNode>
                        </TreeNode>
                      </TreeNode>
                    </TreeNode>
                    <TreeNode
                      label={
                        <div className='styled-node'>
                          <Row>
                            <Col span={8} className='col-node'>
                              <img src={graphImg} alt="img" width="50" height="50" className='img-node'></img>
                            </Col>
                            <Col span={16} className='col-node col-node-text' >
                              <span className='p-node'><b>John Black</b></span>
                              <span className='point-node'>Chief Investment and Technology Officer</span>
                            </Col>
                          </Row>
                        </div>
                      }>
                      <TreeNode label={<div className='styled-node-child'>SVP Investment Management</div>} >
                        <TreeNode label={<div className='styled-node-child'>SVP Corporate Developemnt and IT</div>} >
                          <TreeNode label={<div className='styled-node-child'><span>SVP International Relations <br />and Alliances</span></div>} >

                          </TreeNode>
                        </TreeNode>
                      </TreeNode>
                    </TreeNode>
                    {/* <TreeNode label={<div className='styled-node-child'>SVP Quality Assurance</div>}>
                      <TreeNode label={<div className='styled-node-child'>SVP Security</div>} >
                        <TreeNode label={<div className='styled-node-child'>SVP Technical</div>} >
                          <TreeNode label={<div className='styled-node-child'>SVP Media Relations</div>} >
                            <TreeNode label={<div className='styled-node-child'>SVP Inspection Board</div>} >
                              <TreeNode label={<div className='styled-node-child'>SVP Flight Training</div>} >
                                <TreeNode label={<div className='styled-node-child'>SVP Legal </div>} >
                                  <TreeNode label={<div className='styled-node-child'>SVP Corporate Satisfaction</div>} >

                                  </TreeNode>
                                </TreeNode>
                              </TreeNode>
                            </TreeNode>
                          </TreeNode>
                        </TreeNode>
                      </TreeNode>
                    </TreeNode> */}
                    <TreeNode label={
                      <div className='styled-node'>
                        <Row>
                          <Col span={8} className='col-node'>
                            <img src={graphImg} alt="img" width="50" height="50" className='img-node'></img>
                          </Col>
                          <Col span={16} className='col-node col-node-text' >
                            <span className='p-node'><b>Mark Stewert</b></span>
                            <span className='point-node'>Chief Flight Operation Officer</span>
                          </Col>
                        </Row>
                      </div>
                    }>
                      <TreeNode label={<div className='styled-node-child'>SVP Flight Operation (Chief Pilot)</div>} >
                        <TreeNode label={<div className='styled-node-child'>SVP Cabin Crew Managing</div>} >
                          <TreeNode label={<div className='styled-node-child'>SVP Integrated Operation Control</div>} >

                          </TreeNode>
                        </TreeNode>
                      </TreeNode>
                    </TreeNode>
                    <TreeNode label={
                      <div className='styled-node'>
                        <Row>
                          <Col span={8} className='col-node'>
                            <img src={graphImg} alt="img" width="50" height="50" className='img-node'></img>
                          </Col>
                          <Col span={16} className='col-node col-node-text' >
                            <span className='p-node'><b>Andrea Logan</b></span>
                            <span className='point-node'>Chief Commercial Officer</span>
                          </Col>
                        </Row>
                      </div>
                    }>
                      <TreeNode label={<div className='styled-node-child'>SVP Cargo</div>} >
                        <TreeNode label={<div className='styled-node-child'>SVP Ground Operations</div>} >
                          <TreeNode label={<div className='styled-node-child'>SVP Regional Flights</div>} >
                            <TreeNode label={<div className='styled-node-child'>SVP Catering and In Flight Products</div>} >

                            </TreeNode>
                          </TreeNode>
                        </TreeNode>
                      </TreeNode>
                    </TreeNode>
                    <TreeNode label={
                      <div className='styled-node'>
                        <Row>
                          <Col span={8} className='col-node'>
                            <img src={graphImg} alt="img" width="50" height="50" className='img-node'></img>
                          </Col>
                          <Col span={16} className='col-node col-node-text' >
                            <span className='p-node'><b>Linda Christopher</b></span>
                            <span className='point-node'>Chief Marketing Officer</span>
                          </Col>
                        </Row>
                      </div>
                    } >
                      <TreeNode label={<div className='styled-node-child'>SVP Corporate Marketing And Alternative Distribbution Channel</div>} >
                        <TreeNode label={<div className='styled-node-child'>SVP Corporate Communication</div>} >
                          <TreeNode label={<div className='styled-node-child'>SVP Production Planning</div>} >
                            <TreeNode label={<div className='styled-node-child'>SVP Revenue Management</div>} >
                              <TreeNode label={<div className='styled-node-child'>SVP Marketing and Sales(1st Region)</div>} >
                                <TreeNode label={<div className='styled-node-child'>SVP Marketing and Sales(2nd Region)</div>} >
                                  <TreeNode label={<div className='styled-node-child'>SVP Marketing and Sales(3rd Region)</div>} >

                                  </TreeNode>
                                </TreeNode>
                              </TreeNode>
                            </TreeNode>
                          </TreeNode>
                        </TreeNode>
                      </TreeNode>
                    </TreeNode>
                  </TreeNode>
                </TreeNode>
              </TreeNode>
            </Tree>
          </Col>
        </Row>
      </div >
    </>
  )
}
