import { cloneDeep } from 'lodash';
import { DataSourceVariableModel } from '../types';
import { dispatch } from '../../../store/store';
import { setOptionAsCurrent, setOptionFromUrl } from '../state/actions';
import { VariableAdapter } from '../adapters';
import { dataSourceVariableReducer, initialDataSourceVariableModelState } from './reducer';
import { DataSourceVariableEditor } from './DataSourceVariableEditor';
import { updateDataSourceVariableOptions } from './actions';
import { containsVariable, isAllVariable, toKeyedVariableIdentifier } from '../utils';
import { optionPickerFactory } from '../pickers';
import { ALL_VARIABLE_TEXT } from '../constants';

export const createDataSourceVariableAdapter = (): VariableAdapter<DataSourceVariableModel> => {
  return {
    id: 'datasource',
    description: 'Enabled you to dynamically switch the data source for multiple panels.',
    name: 'Data source',
    initialState: initialDataSourceVariableModelState,
    reducer: dataSourceVariableReducer,
    picker: optionPickerFactory<DataSourceVariableModel>(),
    editor: DataSourceVariableEditor,
    dependsOn: (variable, variableToTest) => {
      if (variable.regex) {
        return containsVariable(variable.regex, variableToTest.name);
      }
      return false;
    },
    setValue: async (variable, option, emitChanges = false) => {
      await dispatch(setOptionAsCurrent(toKeyedVariableIdentifier(variable), option, emitChanges));
    },
    setValueFromUrl: async (variable, urlValue) => {
      await dispatch(setOptionFromUrl(toKeyedVariableIdentifier(variable), urlValue));
    },
    updateOptions: async (variable) => {
      await dispatch(updateDataSourceVariableOptions(toKeyedVariableIdentifier(variable)));
    },
    getSaveModel: (variable) => {
      const { index, id, state, global, rootStateKey, ...rest } = cloneDeep(variable);
      return { ...rest, options: [] };
    },
    getValueForUrl: (variable) => {
      if (isAllVariable(variable)) {
        return ALL_VARIABLE_TEXT;
      }
      return variable.current.value;
    },
  };
};
