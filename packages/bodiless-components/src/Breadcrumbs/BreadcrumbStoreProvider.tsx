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

import React, { ComponentType } from 'react';
import type { BreadcrumbStoreType } from './BreadcrumbStore';

const BreadcrumbsStoreContext = React.createContext<BreadcrumbStoreType | undefined>(undefined);

/**
 * Component that adds react context provider containing store to its children.
 */
const BreadcrumbStoreProvider: ComponentType<any> = ({ children, store }: any) => (
  <BreadcrumbsStoreContext.Provider value={store}>{children}</BreadcrumbsStoreContext.Provider>
);

/**
 * React hook to get store.
 */
const useBreadcrumbStore = () => React.useContext(BreadcrumbsStoreContext);

export {
  useBreadcrumbStore,
  BreadcrumbStoreProvider,
};
