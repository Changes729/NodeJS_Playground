
import React from "react";
import { NavLink } from "react-router-dom";
import {
  PAGE_ROUTE_ROOT,
  PAGE_ROUTE_DOC,
  PAGE_ROUTE_404
} from "../../shared/routes";

const Nav = () => (
  <nav>
    <ul>
      {[
        // { route: PAGE_ROUTE_ROOT, label: "Home" },
        { route: PAGE_ROUTE_DOC, label: "Doc" },
        // { route: PAGE_ROUTE_404, label: "404 Demo" }
      ].map(link => (
        <li key={link.route}>
          <NavLink to={link.route} activeStyle={{ color: "limegreen" }} exact>
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

export default Nav;