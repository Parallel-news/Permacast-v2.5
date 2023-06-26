// TODO: write an article about this

export const TOTAL_LOCAL_STORAGE_LIMIT = 1024 * 1024 * 250; // 250MB



// how to use it
// first instantiate the class in _app.tsx (for conistent render across pages)
// then use it in the component or UI-facing function you want to use it in
// good example at /src/utils/ui.ts ( fetchDominantColor function )

export default class LocalStorageObjectManager {
  localStorageKey: string;
  maxSize: number;
  // maxAge: number;

  constructor(localStorageKey: string, maxSize?: number, maxAge?: number) {
    if (!localStorageKey) throw new Error('No localStorageKey provided');
    this.localStorageKey = localStorageKey;
    try {
      this._ensureLocalStorageIsCallable();
      if (!localStorage.getItem(this.localStorageKey)) {
        this.setObject({});
        this.maxSize = maxSize || 1024 * 1024 * 5; // 5MB
        // this.maxAge = maxAge || 1000 * 60 * 60 * 24 * 7; // 7 days
      }
    } catch (error) {
      // to avoid annoying console.logs
      // console.error(error);
    }
  };

  _ensureLocalStorageIsCallable() {
    try {
      if (!window?.localStorage) {
        throw new Error("Local storage is not available, looks like you're running this function from node or in private mode");
      };  
    } catch {
      // console.log("Local storage is not available, looks like you're running this function from node or in private mode")
    }
  };

  _ensureLocalStorageIsNotFull() {
    try {
      const currentSize = localStorage.getItem(this.localStorageKey).length;
      if (currentSize > this.maxSize) {
        console.log(`cleaning up ${this.localStorageKey} because it's over the max size of ${this.maxSize}`);
        localStorage.setItem(this.localStorageKey, JSON.stringify({}));
      };
    } catch (error) {
      console.error(error);
    };
  };

  // Getter method
  getObject() {
    try {
      this._ensureLocalStorageIsCallable();
      this._ensureLocalStorageIsNotFull();
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
  //! warning: this will overwrite the entire object
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
    try {
      const storedObject = this.getObject();
      return storedObject[objectKey];
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
};

export const getOrSaveToLocalStorage = (key: string, value: string, manager: LocalStorageObjectManager) => {
  const foundValue = manager.getValueFromObject(key);
  if (foundValue) return foundValue;
  manager.addValueToObject(key, value);
}

export const RSS_FEED_MANAGER = 'RSS_FEED_MANAGER';
export const PODCAST_COVER_COLORS_MANAGER = 'PODCAST_COVER_COLORS_MANAGER';
export const PODCAST_DESCRIPTION_MANAGER = 'PODCAST_DESCRIPTION_MANAGER';

export const podcastCoverColorManager = new LocalStorageObjectManager(PODCAST_COVER_COLORS_MANAGER);

export const podcastDescriptionManager = new LocalStorageObjectManager(PODCAST_DESCRIPTION_MANAGER);

export const RSSFeedManager = new LocalStorageObjectManager(RSS_FEED_MANAGER);