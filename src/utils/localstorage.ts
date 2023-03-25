// TODO: write an article about this

export default class LocalStorageObjectManager {
  localStorageKey: string;

  constructor(localStorageKey: string) {
    if (!localStorageKey) throw new Error('No localStorageKey provided');
    this.localStorageKey = localStorageKey;
    try {
      this._ensureLocalStorageIsAvailable();
      if (!localStorage.getItem(this.localStorageKey)) {
        this.setObject({});
      }
    } catch (error) {
      console.error(error);
    }
  };

  _ensureLocalStorageIsAvailable() {
    try {
      if (!window?.localStorage) {
        throw new Error("Local storage is not available, looks like you're running this function from node or in private mode");
      };  
    } catch {
      // console.log("Local storage is not available, looks like you're running this function from node or in private mode")
    }
  };

  // Getter method
  getObject() {
    try {
      this._ensureLocalStorageIsAvailable();
      const value = localStorage.getItem(this.localStorageKey);
      if (!value) throw new Error(`No value found for key: ${this.localStorageKey}`);

      return JSON.parse(value);    
    } catch (error) {
      console.log(error);
      return null
    };
  };

  // Creates a new key/value pair in local storage
  setObject(value: Object) {
    let key = this.localStorageKey;
    try {
      const stringValue = JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    } catch (error) {
      console.error(`Error stringifying value for key: ${key}`);
      return null;
    }
  };

  // setter method for objects
  addValueToObject(newKey: string, newValue: string) {
    try {
      const storedObject = this.getObject();
      storedObject[newKey] = newValue;
      this.setObject(storedObject);
      return storedObject;
    } catch (error) {
      console.error(error);
      return null;
    };
  };

  getValueFromObject(objectKey: string) {
    const storedObject = this.getObject();  
    return storedObject[objectKey];
  };
  
};

export const PODCAST_COVER_COLORS_MANAGER = 'PODCAST_COVER_COLORS_MANAGER';

export const podcastCoverColorManager = new LocalStorageObjectManager(PODCAST_COVER_COLORS_MANAGER);