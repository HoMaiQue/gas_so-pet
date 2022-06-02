import React, { useState } from "react";
import { Link } from "react-router";
import { Collapse, NavItem } from "reactstrap";
import { withNamespaces } from 'react-i18next';
import routes from "../../../routes";

const checkLinkURL = path => path === undefined || path === null ? "#" : `${path}`;
const checkChildren = array => array.children && array.children.length > 0;

const Item = props => {
  const { t, item, level, haveChildren, open, onClick } = props;
  const content = (
    <React.Fragment>
      {level === 0 && <i className={`nav-item-icon ${item.icon}`} />}
      {level === 0 && <p>{t(item.name)}</p>}
      {level > 0 && (
        <span className="sub-item">
          <i className={`nav-sub-item-icon ${item.icon}`} />
          {t(item.name)}
        </span>
      )}
    </React.Fragment>
  );
  return (
    <React.Fragment>
      {!haveChildren && (<Link to={checkLinkURL(item.path)} onClick={() => onClick && onClick()}>{content}</Link>)}
      {haveChildren && (
        <React.Fragment>
          <div className="nav-sub-item-parent" onClick={() => onClick && onClick()}>{content}<span className="caret" /></div>
          <SubMenu items={item.children} open={open} level={level + 1} t={t} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const SubMenu = ({ t, items, open, level }) => (
  <Collapse isOpen={open}>
    <ul className={`nav nav-collapse ${level > 1 ? "subnav" : ""}`}>
      {items && items.map((item, i) => <Root key={i} item={item} haveChildren={checkChildren(item)} level={level + 1} t={t} />)}
    </ul>
  </Collapse>
);

const Root = props => {
  const { level, haveChildren } = props;
  const [open, setOpen] = useState(false);
  return level === 0 ? (
    <NavItem className={`${open === true ? "submenu" : ""}`}>
      <Item {...props} open={open} onClick={() => haveChildren && setOpen(!open)} />
    </NavItem>
  ) : (
      <li>
        <Item {...props} open={open} onClick={() => haveChildren && setOpen(!open)} />
      </li>
    );
};

export default withNamespaces()(({ t }) => routes.map((item, i) => <Root key={i} item={item} haveChildren={checkChildren(item)} level={0} t={t} />));