/**
 * Copyright © 2020 Johnson & Johnson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { flow } from 'lodash';

import {
  withDesign,
  Design,
  stylable,
  replaceWith,
  Fragment,
} from '@bodiless/fclasses';
import {
  WithNodeKeyProps,
} from '@bodiless/core';
import {
  asBodilessList,
  withSubListDesign, withSubLists, asSubList, withDeleteNodeOnUnwrap,
  asBreadcrumb, withBreadcrumbs,
} from '@bodiless/components';
import type { BreadcrumbSettings } from '@bodiless/components';

import { asStylableList } from './SimpleMenu.token';
import withMenuContext from './withMenuContext';

/**
 * Creates a stylable sublist which deletes it's data when the last item is removed.
 * Suitable for use for all menus.
 */
const asMenuSubList = flow(
  asSubList(() => ({ groupLabel: 'Sub-Menu Item' })),
  asStylableList,
  withDesign({
    Wrapper: withDesign({
      WrapperItem: stylable,
      List: stylable,
    }),
  }),
  withDeleteNodeOnUnwrap('sublist'),
);

/**
 * Applies the specified design to the main list and all sublists.
 *
 * @param design
 */
const withMenuDesign = (design: Design<any>) => {
  const withDesign$ = typeof design === 'function' ? design : withDesign(design);
  return flow(
    withSubListDesign(1)({
      SubMenu: withDesign$,
    }),
    withDesign$,
  );
};

/**
 * Bodiless HOC generator which creates the basic structure of the Mega Menu. The component
 * to which the HOC applies is irrelevant (it will be replaced by the Menu wrapper).
 *
 * The base mega menu serves as a base for various views on the Menu data, including
 * a site's main menu, a burger menu and breadcrumbs.
 *
 * @param nodeKeys The optional nodekeys specifying where the data should be stored.
 *
 * @return HOC which creates a basic mega menu list.
 */
const asMenuBase = (nodeKeys?: WithNodeKeyProps) => flow(
  asBodilessList(nodeKeys, undefined, () => ({ groupLabel: 'Menu Item' })),
  asStylableList,
  withSubLists(1)({ SubMenu: asMenuSubList }),
  withMenuContext,
);

/**
 * HOC that can be applied to a menu based component,
 * it renders all list and sublist items but produces no markup.
 */
const withEmptyMenuMarkup = flow(
  withDesign({
    Item: withDesign({
      SubMenu: withDesign({
        Item: replaceWith(Fragment),
      }),
    }),
  }),
  withMenuDesign({
    Wrapper: replaceWith(Fragment),
  }),
  withSubListDesign(1)({
    _default: replaceWith(Fragment),
  }),
);

/**
 * Creates a HOC which can be applied to a mega menu to make it into a site's breadcrumbs
 *
 * @param settings The title and link nodekeys defining where to locate the link and title nodes.
 *
 * @return  HOC for composing a clean (unstyled) site breadcrumb component.
 */
const asBreadcrumbsClean = (settings: BreadcrumbSettings) => flow(
  withEmptyMenuMarkup,
  withMenuDesign({
    Item: flow(
      asBreadcrumb(settings),
    ),
  }),
  withBreadcrumbs,
);

export {
  asMenuBase, asBreadcrumbsClean, withMenuDesign, asMenuSubList,
};
