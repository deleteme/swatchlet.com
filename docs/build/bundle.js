
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (!store || typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, callback) {
        const unsub = store.subscribe(callback);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, fn) {
        return definition[1]
            ? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
            : ctx.$$scope.ctx;
    }
    function get_slot_changes(definition, ctx, changed, fn) {
        return definition[1]
            ? assign({}, assign(ctx.$$scope.changed || {}, definition[1](fn ? fn(changed) : {})))
            : ctx.$$scope.changed || {};
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    let running = false;
    function run_tasks() {
        tasks.forEach(task => {
            if (!task[0](now())) {
                tasks.delete(task);
                task[1]();
            }
        });
        running = tasks.size > 0;
        if (running)
            raf(run_tasks);
    }
    function loop(fn) {
        let task;
        if (!running) {
            running = true;
            raf(run_tasks);
        }
        return {
            promise: new Promise(fulfil => {
                tasks.add(task = [fn, fulfil]);
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function add_resize_listener(element, fn) {
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        const object = document.createElement('object');
        object.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
        object.setAttribute('aria-hidden', 'true');
        object.type = 'text/html';
        object.tabIndex = -1;
        let win;
        object.onload = () => {
            win = object.contentDocument.defaultView;
            win.addEventListener('resize', fn);
        };
        if (/Trident/.test(navigator.userAgent)) {
            element.appendChild(object);
            object.data = 'about:blank';
        }
        else {
            object.data = 'about:blank';
            element.appendChild(object);
        }
        return {
            cancel: () => {
                win && win.removeEventListener && win.removeEventListener('resize', fn);
                element.removeChild(object);
            }
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(html, anchor = null) {
            this.e = element('div');
            this.a = anchor;
            this.u(html);
        }
        m(target, anchor = null) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(target, this.n[i], anchor);
            }
            this.t = target;
        }
        u(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        p(html) {
            this.d();
            this.u(html);
            this.m(this.t, this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let stylesheet;
    let active = 0;
    let current_rules = {};
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        if (!current_rules[name]) {
            if (!stylesheet) {
                const style = element('style');
                document.head.appendChild(style);
                stylesheet = style.sheet;
            }
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        node.style.animation = (node.style.animation || '')
            .split(', ')
            .filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        )
            .join(', ');
        if (name && !--active)
            clear_rules();
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            current_rules = {};
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment && $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined' ? window : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, props) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (key, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
                return ret;
            })
            : prop_values;
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => store.subscribe((value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const isTypeEqual = (a, b) => {
      if (Array.isArray(a) !== Array.isArray(b)) return false;
      return typeof a === typeof b;
    };

    const isStrictlyEqual = (a, b) => a === b;

    const isEqualWithin = (a, b) => {
      return Object.entries(a).every(([aKey, aValue]) => {
        const bValue = b[aKey];
        return isStrictlyEqual(aValue, bValue);
      });
    };

    const isShallowEqual = (a, b) => {
      if (isStrictlyEqual(a, b)) return true;

      if (isTypeEqual(a, b)) {
        if (typeof a === 'object') {
          return isEqualWithin(a, b) && isEqualWithin(b, a);
        } else {
          return isStrictlyEqual(a, b);
        }
      }
      return false;
    };

    const areArrayValuesShallowEqual = (array1, array2) => {
      if (array1.length !== array2.length) {
        return false;
      } else {
        return array1.every((value, i) => {
          return isShallowEqual(value, array2[i]);
        });
      }
    };

    const cache = { calls: new WeakMap(), hits: new WeakMap() };
    const track = (weakmap, fn) => {
      const count = weakmap.get(fn) || 0;
      weakmap.set(fn, count + 1);
    };

    function memoize(fn, enableLog) {
      cache.calls.set(fn, 0);
      cache.hits.set(fn, 0);
      let previousArgs = [];
      let previousValue;

      return function memoized() {
        track(cache.calls, fn);
        const args = [...arguments];
        if (areArrayValuesShallowEqual(previousArgs, args)) {
          track(cache.hits, fn);
          //if (enableLog) log(fn);
          return previousValue;
        } else {
          if (enableLog)
            console.log(
              fn,
              'miss!\n  previousArgs',
              previousArgs,
              '\n  !== args',
              args
            );
          const value = fn(...args);
          previousArgs = args;
          previousValue = value;
          //if (enableLog) log(fn);
          return value;
        }
      };
    }

    const fragmentRegExp = /#(.+)$/;

    const getPickingValue = string => {
      const match = string.match(/p(\d)+$/);
      if (!match) return null;
      const [_, digits] = match;
      return digits.length > 0 ? Number(digits) : null;
    };

    const parseURL = memoize(function _parseURL(url) {
      const match = url.match(fragmentRegExp);
      if (!match) return;
      const [_, paramString] = match;
      // bail early again
      if (!paramString || paramString.length === 0) return;
      const parts = paramString
        .split(',')
        .filter(function rejectPickingValue(value) {
          return !value.startsWith('p');
        })
        .map(value => value.toLowerCase());
      return {
        swatches: valuesToSwatches(parts),
        picking: getPickingValue(paramString)
      };
    });

    const valuesToSwatches = memoize(function _valuesToSwatches(values) {
      return values.map(value => ({ value: `#${value}` }));
    });

    function toString(state) {
      const { picking, swatches } = state;
      const parts = swatches.map(({ value }) =>
        value.replace('#', '').toUpperCase()
      );
      if (picking !== null) {
        parts.push(`p${picking}`);
      }
      return parts.join(',');
    }

    function renderHash(state) {
      return `#${toString(state)}`;
    }

    const longHex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    const shortHex = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i;

    function hexToRgb(hex) {
      let result = shortHex.exec(hex);
      if (result) {
        result = result.map(fragment => fragment.repeat(2));
      } else {
        result = longHex.exec(hex);
      }
      return result
        ? {
            R: parseInt(result[1], 16),
            G: parseInt(result[2], 16),
            B: parseInt(result[3], 16)
          }
        : null;
    }

    function rgbStringToComponents(rgbString) {
      const [R, G, B] = rgbString
        .replace(/[a-z\(\)]/g, '')
        .split(',')
        .map(Number);
      return { R, G, B };
    }

    const initialStateFromURL = parseURL(location.href) || {};

    const defaultState = {
      swatches: [{ value: '#ffffff' }, { value: '#ff00cc' }],
      picking: null
    };

    const swatches = writable(
      initialStateFromURL.swatches || defaultState.swatches
    );

    const picking = writable(defaultState.picking);

    const pick = index => {
      picking.set(index);
    };

    const cancelPicking = () => {
      picking.set(defaultState.picking);
    };

    const pickingSwatch = derived(
      [picking, swatches],
      ([picking, swatches]) => {
        return swatches[picking] || null;
      }
    );

    const pickingSwatchRgb = derived(pickingSwatch, swatch => {
      var swatchRgb;
      if (!swatch) return;
      if (swatch.value.startsWith('#')) {
        swatchRgb = hexToRgb(swatch.value);
      } else if (swatch.value.startsWith('rgb')) {
        swatchRgb = rgbStringToComponents(swatch.value);
      } else {
        console.warning('unexpected value for swatch', swatch);
      }
      return swatchRgb;
    });

    const swatchesDimensions = writable({});

    swatchesDimensions.subscribe(v => {
      console.log('swatchesDimensions', v);
    });

    const swatchesDimensionsIsReady = derived(swatchesDimensions, d => {
      return (
        Object.values(d).filter(dimensions => {
          return dimensions !== null;
        }).length > 0
      );
    });

    const isMobileMediaQuery = window.matchMedia(
      '(min-width: 0) and (max-width: 812px)'
    );

    const isMobile = writable(isMobileMediaQuery.matches);

    isMobileMediaQuery.addListener(e => {
      isMobile.set(e.matches);
    });

    /* src/ButtonLink.svelte generated by Svelte v3.15.0 */

    const file = "src/ButtonLink.svelte";

    function create_fragment(ctx) {
    	let a;
    	let a_class_value;
    	let current;
    	let dispose;
    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			attr_dev(a, "href", ctx.href);
    			attr_dev(a, "class", a_class_value = "" + (null_to_empty(ctx.klass) + " svelte-176v7yp"));
    			add_location(a, file, 31, 0, 520);
    			dispose = listen_dev(a, "click", ctx.click_handler, false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;
    		},
    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(get_slot_changes(default_slot_template, ctx, changed, null), get_slot_context(default_slot_template, ctx, null));
    			}

    			if (!current || changed.href) {
    				attr_dev(a, "href", ctx.href);
    			}

    			if (!current || changed.klass && a_class_value !== (a_class_value = "" + (null_to_empty(ctx.klass) + " svelte-176v7yp"))) {
    				attr_dev(a, "class", a_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { href = "" } = $$props;
    	let { class: klass = "" } = $$props;
    	const writable_props = ["href", "class"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ButtonLink> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("href" in $$props) $$invalidate("href", href = $$props.href);
    		if ("class" in $$props) $$invalidate("klass", klass = $$props.class);
    		if ("$$scope" in $$props) $$invalidate("$$scope", $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { href, klass };
    	};

    	$$self.$inject_state = $$props => {
    		if ("href" in $$props) $$invalidate("href", href = $$props.href);
    		if ("klass" in $$props) $$invalidate("klass", klass = $$props.klass);
    	};

    	return {
    		href,
    		klass,
    		click_handler,
    		$$slots,
    		$$scope
    	};
    }

    class ButtonLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { href: 0, class: "klass" });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ButtonLink",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get href() {
    		throw new Error("<ButtonLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<ButtonLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<ButtonLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ButtonLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Button.svelte generated by Svelte v3.15.0 */

    const file$1 = "src/Button.svelte";

    function create_fragment$1(ctx) {
    	let button;
    	let button_class_value;
    	let current;
    	let dispose;
    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "type", ctx.type);
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(ctx.klass) + " svelte-lgq4d3"));
    			add_location(button, file$1, 31, 0, 539);
    			dispose = listen_dev(button, "click", ctx.click_handler, false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;
    		},
    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(get_slot_changes(default_slot_template, ctx, changed, null), get_slot_context(default_slot_template, ctx, null));
    			}

    			if (!current || changed.type) {
    				attr_dev(button, "type", ctx.type);
    			}

    			if (!current || changed.klass && button_class_value !== (button_class_value = "" + (null_to_empty(ctx.klass) + " svelte-lgq4d3"))) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { type = "button" } = $$props;
    	let { class: klass = "" } = $$props;
    	const writable_props = ["type", "class"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("type" in $$props) $$invalidate("type", type = $$props.type);
    		if ("class" in $$props) $$invalidate("klass", klass = $$props.class);
    		if ("$$scope" in $$props) $$invalidate("$$scope", $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { type, klass };
    	};

    	$$self.$inject_state = $$props => {
    		if ("type" in $$props) $$invalidate("type", type = $$props.type);
    		if ("klass" in $$props) $$invalidate("klass", klass = $$props.klass);
    	};

    	return {
    		type,
    		klass,
    		click_handler,
    		$$slots,
    		$$scope
    	};
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { type: 0, class: "klass" });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ActionBar.svelte generated by Svelte v3.15.0 */

    const file$2 = "src/ActionBar.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let current;
    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "actions svelte-ni5ocr");
    			add_location(div, file$2, 12, 0, 174);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(get_slot_changes(default_slot_template, ctx, changed, null), get_slot_context(default_slot_template, ctx, null));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate("$$scope", $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		
    	};

    	return { $$slots, $$scope };
    }

    class ActionBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ActionBar",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    function isLightColor({ R, G, B }) {
      const sum = Math.round((R * 299 + G * 587 + B * 114) / 1000);
      return sum > 128;
    }

    function getHighContrastColorFromHex(hex) {
      const RGB = hexToRgb(hex);
      return isLightColor(RGB) ? '#000' : '#FFF';
    }

    /* src/Swatch.svelte generated by Svelte v3.15.0 */
    const file$3 = "src/Swatch.svelte";

    // (125:4) {#if !$isMobile}
    function create_if_block(ctx) {
    	let current;

    	const actionbar = new ActionBar({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(actionbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(actionbar, target, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const actionbar_changes = {};

    			if (changed.$$scope || changed.removeHref) {
    				actionbar_changes.$$scope = { changed, ctx };
    			}

    			actionbar.$set(actionbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(actionbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(125:4) {#if !$isMobile}",
    		ctx
    	});

    	return block;
    }

    // (127:8) <ButtonLink href={removeHref} class='swatch-action'>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Remove");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(127:8) <ButtonLink href={removeHref} class='swatch-action'>",
    		ctx
    	});

    	return block;
    }

    // (126:6) <ActionBar>
    function create_default_slot(ctx) {
    	let current;

    	const buttonlink = new ButtonLink({
    			props: {
    				href: ctx.removeHref,
    				class: "swatch-action",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(buttonlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(buttonlink, target, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const buttonlink_changes = {};
    			if (changed.removeHref) buttonlink_changes.href = ctx.removeHref;

    			if (changed.$$scope) {
    				buttonlink_changes.$$scope = { changed, ctx };
    			}

    			buttonlink.$set(buttonlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttonlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttonlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buttonlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(126:6) <ActionBar>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let window;
    	let t0;
    	let div1;
    	let div0;
    	let span;
    	let t1;
    	let t2;
    	let div1_style_value;
    	let current;
    	let dispose;
    	let if_block = !ctx.$isMobile && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			window = element("window");
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			t1 = text(ctx.value);
    			t2 = space();
    			if (if_block) if_block.c();
    			add_location(window, file$3, 109, 0, 2639);
    			attr_dev(span, "class", "value svelte-1y2vvm0");
    			set_style(span, "font-size", ctx.valueFontSize);
    			set_style(span, "color", ctx.contrastingColor);
    			add_location(span, file$3, 120, 4, 2958);
    			attr_dev(div0, "class", "swatch-inner svelte-1y2vvm0");
    			set_style(div0, "background-color", ctx.value);
    			add_location(div0, file$3, 116, 2, 2881);
    			attr_dev(div1, "class", "swatch svelte-1y2vvm0");
    			attr_dev(div1, "style", div1_style_value = "" + (ctx.outerBackgroundColor + "; color: " + ctx.contrastingColor + ";"));
    			toggle_class(div1, "swatch-is-hovering", isHovering);
    			add_location(div1, file$3, 110, 0, 2681);

    			dispose = [
    				listen_dev(window, "resize", ctx.handleWindowResize, false, false, false),
    				listen_dev(div1, "click", ctx.click_handler, false, false, false)
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, window, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t1);
    			append_dev(div0, t2);
    			if (if_block) if_block.m(div0, null);
    			ctx.div1_binding(div1);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			if (!current || changed.value) set_data_dev(t1, ctx.value);

    			if (!current || changed.valueFontSize) {
    				set_style(span, "font-size", ctx.valueFontSize);
    			}

    			if (!current || changed.contrastingColor) {
    				set_style(span, "color", ctx.contrastingColor);
    			}

    			if (!ctx.$isMobile) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || changed.value) {
    				set_style(div0, "background-color", ctx.value);
    			}

    			if (!current || (changed.outerBackgroundColor || changed.contrastingColor) && div1_style_value !== (div1_style_value = "" + (ctx.outerBackgroundColor + "; color: " + ctx.contrastingColor + ";"))) {
    				attr_dev(div1, "style", div1_style_value);
    			}

    			if (changed.isHovering) {
    				toggle_class(div1, "swatch-is-hovering", isHovering);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(window);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			ctx.div1_binding(null);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    let isHovering = false;

    function instance$3($$self, $$props, $$invalidate) {
    	let $swatches;
    	let $isMobile;
    	let $swatchesDimensions;
    	validate_store(swatches, "swatches");
    	component_subscribe($$self, swatches, $$value => $$invalidate("$swatches", $swatches = $$value));
    	validate_store(isMobile, "isMobile");
    	component_subscribe($$self, isMobile, $$value => $$invalidate("$isMobile", $isMobile = $$value));
    	validate_store(swatchesDimensions, "swatchesDimensions");
    	component_subscribe($$self, swatchesDimensions, $$value => $$invalidate("$swatchesDimensions", $swatchesDimensions = $$value));
    	let { i } = $$props;
    	let { value } = $$props;

    	const safe = (fn, fallback) => {
    		try {
    			const v = fn();
    			return v;
    		} catch(e) {
    			return fallback;
    		}
    	};

    	let element;

    	const measure = () => {
    		let { offsetWidth, offsetHeight, offsetLeft, offsetTop } = element;
    		let parentElement = element.parentElement;

    		while (parentElement) {
    			offsetLeft += parentElement.offsetLeft;
    			offsetTop += parentElement.offsetTop;
    			parentElement = parentElement.parentElement;
    		}

    		return {
    			offsetWidth,
    			offsetHeight,
    			offsetLeft,
    			offsetTop
    		};
    	};

    	const isAnchor = e => e.target.tagName === "A";

    	const measureDimensions = () => {
    		set_store_value(swatchesDimensions, $swatchesDimensions = { ...$swatchesDimensions, [i]: measure() });
    	};

    	const handleWindowResize = () => {
    		measureDimensions();
    	};

    	onMount(measureDimensions);

    	onDestroy(() => {
    		set_store_value(swatchesDimensions, $swatchesDimensions = { ...$swatchesDimensions, [i]: null });
    	});

    	const writable_props = ["i", "value"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Swatch> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate("element", element = $$value);
    		});
    	}

    	const click_handler = e => {
    		if (!isAnchor(e)) {
    			pick(i);
    		}
    	};

    	$$self.$set = $$props => {
    		if ("i" in $$props) $$invalidate("i", i = $$props.i);
    		if ("value" in $$props) $$invalidate("value", value = $$props.value);
    	};

    	$$self.$capture_state = () => {
    		return {
    			i,
    			value,
    			isHovering,
    			element,
    			removeHref,
    			$swatches,
    			contrastingColor,
    			outerBackgroundColor,
    			valueFontSize,
    			$isMobile,
    			$swatchesDimensions
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("i" in $$props) $$invalidate("i", i = $$props.i);
    		if ("value" in $$props) $$invalidate("value", value = $$props.value);
    		if ("isHovering" in $$props) $$invalidate("isHovering", isHovering = $$props.isHovering);
    		if ("element" in $$props) $$invalidate("element", element = $$props.element);
    		if ("removeHref" in $$props) $$invalidate("removeHref", removeHref = $$props.removeHref);
    		if ("$swatches" in $$props) swatches.set($swatches = $$props.$swatches);
    		if ("contrastingColor" in $$props) $$invalidate("contrastingColor", contrastingColor = $$props.contrastingColor);
    		if ("outerBackgroundColor" in $$props) $$invalidate("outerBackgroundColor", outerBackgroundColor = $$props.outerBackgroundColor);
    		if ("valueFontSize" in $$props) $$invalidate("valueFontSize", valueFontSize = $$props.valueFontSize);
    		if ("$isMobile" in $$props) isMobile.set($isMobile = $$props.$isMobile);
    		if ("$swatchesDimensions" in $$props) swatchesDimensions.set($swatchesDimensions = $$props.$swatchesDimensions);
    	};

    	let removeHref;
    	let contrastingColor;
    	let outerBackgroundColor;
    	let valueFontSize;

    	$$self.$$.update = (changed = { $swatches: 1, i: 1, value: 1, isHovering: 1, $isMobile: 1 }) => {
    		if (changed.$swatches || changed.i) {
    			 $$invalidate("removeHref", removeHref = renderHash({
    				swatches: $swatches.filter((s, j) => {
    					return i !== j;
    				})
    			}));
    		}

    		if (changed.value) {
    			 $$invalidate("contrastingColor", contrastingColor = safe(() => getHighContrastColorFromHex(value), "#000"));
    		}

    		if (changed.isHovering || changed.value) {
    			 $$invalidate("outerBackgroundColor", outerBackgroundColor = isHovering ? "" : `background-color: ${value}`);
    		}

    		if (changed.$isMobile || changed.$swatches) {
    			 $$invalidate("valueFontSize", valueFontSize = $isMobile
    			? "10vw"
    			: `calc(100vw / ${$swatches.length} * 0.2)`);
    		}
    	};

    	return {
    		i,
    		value,
    		element,
    		isAnchor,
    		handleWindowResize,
    		removeHref,
    		contrastingColor,
    		outerBackgroundColor,
    		valueFontSize,
    		$isMobile,
    		div1_binding,
    		click_handler
    	};
    }

    class Swatch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { i: 0, value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Swatch",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (ctx.i === undefined && !("i" in props)) {
    			console.warn("<Swatch> was created without expected prop 'i'");
    		}

    		if (ctx.value === undefined && !("value" in props)) {
    			console.warn("<Swatch> was created without expected prop 'value'");
    		}
    	}

    	get i() {
    		throw new Error("<Swatch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set i(value) {
    		throw new Error("<Swatch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Swatch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Swatch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Swatches.svelte generated by Svelte v3.15.0 */
    const file$4 = "src/Swatches.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.swatch = list[i];
    	child_ctx.i = i;
    	return child_ctx;
    }

    // (23:2) {#each $swatches as swatch, i}
    function create_each_block(ctx) {
    	let current;

    	const swatch = new Swatch({
    			props: { value: ctx.swatch.value, i: ctx.i },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(swatch.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(swatch, target, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const swatch_changes = {};
    			if (changed.$swatches) swatch_changes.value = ctx.swatch.value;
    			swatch.$set(swatch_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(swatch.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(swatch.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(swatch, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(23:2) {#each $swatches as swatch, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let current;
    	let each_value = ctx.$swatches;
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "swatches svelte-s7zxiq");
    			add_location(div, file$4, 21, 0, 327);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(changed, ctx) {
    			if (changed.$swatches) {
    				each_value = ctx.$swatches;
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $swatches;
    	validate_store(swatches, "swatches");
    	component_subscribe($$self, swatches, $$value => $$invalidate("$swatches", $swatches = $$value));

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("$swatches" in $$props) swatches.set($swatches = $$props.$swatches);
    	};

    	return { $swatches };
    }

    class Swatches extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Swatches",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/AddNewColor.svelte generated by Svelte v3.15.0 */

    // (10:0) <ButtonLink href={addHref}>
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("+ Add New Color");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(10:0) <ButtonLink href={addHref}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let current;

    	const buttonlink = new ButtonLink({
    			props: {
    				href: ctx.addHref,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(buttonlink.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(buttonlink, target, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const buttonlink_changes = {};
    			if (changed.addHref) buttonlink_changes.href = ctx.addHref;

    			if (changed.$$scope) {
    				buttonlink_changes.$$scope = { changed, ctx };
    			}

    			buttonlink.$set(buttonlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttonlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttonlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buttonlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $swatches;
    	validate_store(swatches, "swatches");
    	component_subscribe($$self, swatches, $$value => $$invalidate("$swatches", $swatches = $$value));

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("addHref" in $$props) $$invalidate("addHref", addHref = $$props.addHref);
    		if ("$swatches" in $$props) swatches.set($swatches = $$props.$swatches);
    	};

    	let addHref;

    	$$self.$$.update = (changed = { $swatches: 1 }) => {
    		if (changed.$swatches) {
    			 $$invalidate("addHref", addHref = renderHash({
    				swatches: [...$swatches, { value: "#ffffff" }]
    			}));
    		}
    	};

    	return { addHref };
    }

    class AddNewColor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddNewColor",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/Header.svelte generated by Svelte v3.15.0 */
    const file$5 = "src/Header.svelte";

    function create_fragment$6(ctx) {
    	let header;
    	let h1;
    	let t1;
    	let div;
    	let current;
    	const addnewcolor = new AddNewColor({ $$inline: true });

    	const block = {
    		c: function create() {
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = "swatchlet.com: share colors easily.";
    			t1 = space();
    			div = element("div");
    			create_component(addnewcolor.$$.fragment);
    			attr_dev(h1, "class", "svelte-1429svp");
    			add_location(h1, file$5, 31, 2, 430);
    			add_location(div, file$5, 34, 2, 485);
    			attr_dev(header, "class", "svelte-1429svp");
    			add_location(header, file$5, 30, 0, 419);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    			append_dev(header, t1);
    			append_dev(header, div);
    			mount_component(addnewcolor, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(addnewcolor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(addnewcolor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(addnewcolor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    const COLOR_MODEL_RGB = 'RGB';
    const [R, G, B] = COLOR_MODEL_RGB.split('');
    const RANGES = {
      R: [0, 255],
      G: [0, 255],
      B: [0, 255],
      H: [0, 360],
      S: [0, 100],
      L: [0, 100]
    };

    const pinned = writable(B);
    const colorModel = writable(COLOR_MODEL_RGB);
    const width = writable(null);
    const height = writable(null);

    const canvasState = derived(
      [pinned, colorModel, width, height],
      ([pinned, colorModel, width, height]) => {
        return { pinned, colorModel, width, height };
      }
    );

    const tracking = writable(null);

    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? '0' + hex : hex;
    }

    function rgbToHex(r, g, b) {
      return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function quintOut(t) {
        return --t * t * t * t * t + 1;
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function tick_spring(ctx, last_value, current_value, target_value) {
        if (typeof current_value === 'number' || is_date(current_value)) {
            // @ts-ignore
            const delta = target_value - current_value;
            // @ts-ignore
            const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
            const spring = ctx.opts.stiffness * delta;
            const damper = ctx.opts.damping * velocity;
            const acceleration = (spring - damper) * ctx.inv_mass;
            const d = (velocity + acceleration) * ctx.dt;
            if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
                return target_value; // settled
            }
            else {
                ctx.settled = false; // signal loop to keep ticking
                // @ts-ignore
                return is_date(current_value) ?
                    new Date(current_value.getTime() + d) : current_value + d;
            }
        }
        else if (Array.isArray(current_value)) {
            // @ts-ignore
            return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
        }
        else if (typeof current_value === 'object') {
            const next_value = {};
            for (const k in current_value)
                // @ts-ignore
                next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
            // @ts-ignore
            return next_value;
        }
        else {
            throw new Error(`Cannot spring ${typeof current_value} values`);
        }
    }
    function spring(value, opts = {}) {
        const store = writable(value);
        const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
        let last_time;
        let task;
        let current_token;
        let last_value = value;
        let target_value = value;
        let inv_mass = 1;
        let inv_mass_recovery_rate = 0;
        let cancel_task = false;
        /* eslint-disable @typescript-eslint/no-use-before-define */
        function set(new_value, opts = {}) {
            target_value = new_value;
            const token = current_token = {};
            if (value == null || opts.hard || (spring.stiffness >= 1 && spring.damping >= 1)) {
                cancel_task = true; // cancel any running animation
                last_time = now();
                last_value = new_value;
                store.set(value = target_value);
                return Promise.resolve();
            }
            else if (opts.soft) {
                const rate = opts.soft === true ? .5 : +opts.soft;
                inv_mass_recovery_rate = 1 / (rate * 60);
                inv_mass = 0; // infinite mass, unaffected by spring forces
            }
            if (!task) {
                last_time = now();
                cancel_task = false;
                task = loop(now => {
                    if (cancel_task) {
                        cancel_task = false;
                        task = null;
                        return false;
                    }
                    inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
                    const ctx = {
                        inv_mass,
                        opts: spring,
                        settled: true,
                        dt: (now - last_time) * 60 / 1000
                    };
                    const next_value = tick_spring(ctx, last_value, value, target_value);
                    last_time = now;
                    last_value = value;
                    store.set(value = next_value);
                    if (ctx.settled)
                        task = null;
                    return !ctx.settled;
                });
            }
            return new Promise(fulfil => {
                task.promise.then(() => {
                    if (token === current_token)
                        fulfil();
                });
            });
        }
        /* eslint-enable @typescript-eslint/no-use-before-define */
        const spring = {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe,
            stiffness,
            damping,
            precision
        };
        return spring;
    }

    /* src/PrimaryCursor.svelte generated by Svelte v3.15.0 */
    const file$6 = "src/PrimaryCursor.svelte";

    function create_fragment$7(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "cursor svelte-1i2kyi");
    			attr_dev(div, "style", ctx.transform);
    			add_location(div, file$6, 42, 0, 1039);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(changed, ctx) {
    			if (changed.transform) {
    				attr_dev(div, "style", ctx.transform);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $coords;
    	const initialLeft = -1;
    	const initialTop = -1;
    	let transform = "";
    	let { left = initialLeft } = $$props;
    	let { top = initialTop } = $$props;
    	const coords = spring({ left, top }, { stiffness: 0.2, damping: 0.8 });
    	validate_store(coords, "coords");
    	component_subscribe($$self, coords, value => $$invalidate("$coords", $coords = value));
    	const writable_props = ["left", "top"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PrimaryCursor> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("left" in $$props) $$invalidate("left", left = $$props.left);
    		if ("top" in $$props) $$invalidate("top", top = $$props.top);
    	};

    	$$self.$capture_state = () => {
    		return {
    			transform,
    			left,
    			top,
    			isUsingDefaults,
    			isSettled,
    			$coords,
    			initialized
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("transform" in $$props) $$invalidate("transform", transform = $$props.transform);
    		if ("left" in $$props) $$invalidate("left", left = $$props.left);
    		if ("top" in $$props) $$invalidate("top", top = $$props.top);
    		if ("isUsingDefaults" in $$props) $$invalidate("isUsingDefaults", isUsingDefaults = $$props.isUsingDefaults);
    		if ("isSettled" in $$props) $$invalidate("isSettled", isSettled = $$props.isSettled);
    		if ("$coords" in $$props) coords.set($coords = $$props.$coords);
    		if ("initialized" in $$props) initialized = $$props.initialized;
    	};

    	let isUsingDefaults;
    	let isSettled;
    	let initialized;

    	$$self.$$.update = (changed = { left: 1, top: 1, $coords: 1, isUsingDefaults: 1, isSettled: 1 }) => {
    		if (changed.left || changed.top) {
    			 $$invalidate("isUsingDefaults", isUsingDefaults = left === initialLeft || top === initialTop);
    		}

    		if (changed.$coords || changed.left || changed.top) {
    			 $$invalidate("isSettled", isSettled = $coords.left === left && $coords.top === top);
    		}

    		if (changed.isUsingDefaults) {
    			 initialized = !isUsingDefaults;
    		}

    		if (changed.isUsingDefaults || changed.isSettled || changed.left || changed.top || changed.$coords) {
    			 {
    				if (!isUsingDefaults) {
    					if (!isSettled) {
    						coords.set({ left, top });
    					}

    					$$invalidate("transform", transform = `transform: translateX(${$coords.left}px) translateY(${$coords.top}px);`);
    				}
    			}
    		}
    	};

    	return { transform, left, top, coords };
    }

    class PrimaryCursor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$7, safe_not_equal, { left: 0, top: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PrimaryCursor",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get left() {
    		throw new Error("<PrimaryCursor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<PrimaryCursor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get top() {
    		throw new Error("<PrimaryCursor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top(value) {
    		throw new Error("<PrimaryCursor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/PinnedCursor.svelte generated by Svelte v3.15.0 */
    const file$7 = "src/PinnedCursor.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "pinned-cursor svelte-1lmbq8l");
    			attr_dev(div, "style", div_style_value = "" + (ctx.transform + " width: " + (ctx.width + 3 * 2) + "px;"));
    			toggle_class(div, "initialized", ctx.initialized);
    			add_location(div, file$7, 45, 0, 1020);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(changed, ctx) {
    			if ((changed.transform || changed.width) && div_style_value !== (div_style_value = "" + (ctx.transform + " width: " + (ctx.width + 3 * 2) + "px;"))) {
    				attr_dev(div, "style", div_style_value);
    			}

    			if (changed.initialized) {
    				toggle_class(div, "initialized", ctx.initialized);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $coords;
    	const initialLeft = -1;
    	const initialTop = -1;
    	let transform = "";
    	let { left = initialLeft } = $$props;
    	let { top = initialTop } = $$props;
    	let { width = 10 } = $$props;
    	const coords = spring({ left, top }, { stiffness: 0.2, damping: 0.8 });
    	validate_store(coords, "coords");
    	component_subscribe($$self, coords, value => $$invalidate("$coords", $coords = value));
    	const writable_props = ["left", "top", "width"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PinnedCursor> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("left" in $$props) $$invalidate("left", left = $$props.left);
    		if ("top" in $$props) $$invalidate("top", top = $$props.top);
    		if ("width" in $$props) $$invalidate("width", width = $$props.width);
    	};

    	$$self.$capture_state = () => {
    		return {
    			transform,
    			left,
    			top,
    			width,
    			isUsingDefaults,
    			isSettled,
    			$coords,
    			initialized
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("transform" in $$props) $$invalidate("transform", transform = $$props.transform);
    		if ("left" in $$props) $$invalidate("left", left = $$props.left);
    		if ("top" in $$props) $$invalidate("top", top = $$props.top);
    		if ("width" in $$props) $$invalidate("width", width = $$props.width);
    		if ("isUsingDefaults" in $$props) $$invalidate("isUsingDefaults", isUsingDefaults = $$props.isUsingDefaults);
    		if ("isSettled" in $$props) $$invalidate("isSettled", isSettled = $$props.isSettled);
    		if ("$coords" in $$props) coords.set($coords = $$props.$coords);
    		if ("initialized" in $$props) $$invalidate("initialized", initialized = $$props.initialized);
    	};

    	let isUsingDefaults;
    	let isSettled;
    	let initialized;

    	$$self.$$.update = (changed = { left: 1, top: 1, $coords: 1, isUsingDefaults: 1, isSettled: 1 }) => {
    		if (changed.left || changed.top) {
    			 $$invalidate("isUsingDefaults", isUsingDefaults = left === initialLeft || top === initialTop);
    		}

    		if (changed.$coords || changed.left || changed.top) {
    			 $$invalidate("isSettled", isSettled = $coords.left === left && $coords.top === top);
    		}

    		if (changed.isUsingDefaults) {
    			 $$invalidate("initialized", initialized = !isUsingDefaults);
    		}

    		if (changed.isUsingDefaults || changed.isSettled || changed.left || changed.top || changed.$coords) {
    			 {
    				if (!isUsingDefaults) {
    					if (!isSettled) {
    						coords.set({ left, top });
    					}

    					$$invalidate("transform", transform = `transform: translateX(${$coords.left}px) translateY(${$coords.top}px);`);
    				}
    			}
    		}
    	};

    	return {
    		transform,
    		left,
    		top,
    		width,
    		coords,
    		initialized
    	};
    }

    class PinnedCursor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$8, safe_not_equal, { left: 0, top: 0, width: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PinnedCursor",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get left() {
    		throw new Error("<PinnedCursor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<PinnedCursor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get top() {
    		throw new Error("<PinnedCursor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top(value) {
    		throw new Error("<PinnedCursor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<PinnedCursor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<PinnedCursor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function trap(n) {
      return Math.max(Math.min(n, 1), 0);
    }

    /* src/PickerCanvas.svelte generated by Svelte v3.15.0 */
    const file$8 = "src/PickerCanvas.svelte";

    // (339:2) {#if cursorLeft >= 0 && cursorTop >= 0}
    function create_if_block_1(ctx) {
    	let current;

    	const primarycursor = new PrimaryCursor({
    			props: { left: ctx.cursorLeft, top: ctx.cursorTop },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(primarycursor.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(primarycursor, target, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const primarycursor_changes = {};
    			if (changed.cursorLeft) primarycursor_changes.left = ctx.cursorLeft;
    			if (changed.cursorTop) primarycursor_changes.top = ctx.cursorTop;
    			primarycursor.$set(primarycursor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(primarycursor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(primarycursor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(primarycursor, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(339:2) {#if cursorLeft >= 0 && cursorTop >= 0}",
    		ctx
    	});

    	return block;
    }

    // (342:2) {#if pinnedCursorLeft >= 0 && pinnedCursorTop >= 0}
    function create_if_block$1(ctx) {
    	let current;

    	const pinnedcursor = new PinnedCursor({
    			props: {
    				left: ctx.pinnedCursorLeft,
    				top: ctx.pinnedCursorTop,
    				width: ctx.pinnedCursorWidth
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pinnedcursor.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pinnedcursor, target, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const pinnedcursor_changes = {};
    			if (changed.pinnedCursorLeft) pinnedcursor_changes.left = ctx.pinnedCursorLeft;
    			if (changed.pinnedCursorTop) pinnedcursor_changes.top = ctx.pinnedCursorTop;
    			if (changed.pinnedCursorWidth) pinnedcursor_changes.width = ctx.pinnedCursorWidth;
    			pinnedcursor.$set(pinnedcursor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pinnedcursor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pinnedcursor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pinnedcursor, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(342:2) {#if pinnedCursorLeft >= 0 && pinnedCursorTop >= 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let canvas;
    	let canvas_resize_listener;
    	let t0;
    	let t1;
    	let current;
    	let dispose;
    	let if_block0 = ctx.cursorLeft >= 0 && ctx.cursorTop >= 0 && create_if_block_1(ctx);
    	let if_block1 = ctx.pinnedCursorLeft >= 0 && ctx.pinnedCursorTop >= 0 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			canvas = element("canvas");
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(canvas, "class", "svelte-1q2x4cw");
    			add_render_callback(() => ctx.canvas_elementresize_handler.call(canvas));
    			add_location(canvas, file$8, 325, 2, 8658);
    			attr_dev(div, "class", "picker-canvas svelte-1q2x4cw");
    			add_location(div, file$8, 324, 0, 8628);

    			dispose = [
    				listen_dev(window, "resize", ctx.handleWindowResize, false, false, false),
    				listen_dev(canvas, "mousedown", ctx.handleMouseDown, false, false, false),
    				listen_dev(canvas, "mouseup", ctx.handleMouseUp, false, false, false),
    				listen_dev(canvas, "mousemove", ctx.handleMouseMove, false, false, false),
    				listen_dev(canvas, "touchstart", ctx.handleMouseDown, false, false, false),
    				listen_dev(canvas, "touchend", ctx.handleMouseUp, false, false, false),
    				listen_dev(canvas, "touchcancel", ctx.handleMouseUp, false, false, false),
    				listen_dev(canvas, "touchmove", prevent_default(ctx.handleMouseMove), false, false, true)
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, canvas);
    			canvas_resize_listener = add_resize_listener(canvas, ctx.canvas_elementresize_handler.bind(canvas));
    			ctx.canvas_binding(canvas);
    			append_dev(div, t0);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t1);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			if (ctx.cursorLeft >= 0 && ctx.cursorTop >= 0) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (ctx.pinnedCursorLeft >= 0 && ctx.pinnedCursorTop >= 0) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			canvas_resize_listener.cancel();
    			ctx.canvas_binding(null);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const primaryVsPinnedThreshold = 0.65;

    function instance$8($$self, $$props, $$invalidate) {
    	let $colorModel;
    	let $pinned;
    	let $width;
    	let $height;
    	let $pickingSwatchRgb;
    	let $swatches;
    	let $picking;
    	let $tracking;
    	validate_store(colorModel, "colorModel");
    	component_subscribe($$self, colorModel, $$value => $$invalidate("$colorModel", $colorModel = $$value));
    	validate_store(pinned, "pinned");
    	component_subscribe($$self, pinned, $$value => $$invalidate("$pinned", $pinned = $$value));
    	validate_store(width, "width");
    	component_subscribe($$self, width, $$value => $$invalidate("$width", $width = $$value));
    	validate_store(height, "height");
    	component_subscribe($$self, height, $$value => $$invalidate("$height", $height = $$value));
    	validate_store(pickingSwatchRgb, "pickingSwatchRgb");
    	component_subscribe($$self, pickingSwatchRgb, $$value => $$invalidate("$pickingSwatchRgb", $pickingSwatchRgb = $$value));
    	validate_store(swatches, "swatches");
    	component_subscribe($$self, swatches, $$value => $$invalidate("$swatches", $swatches = $$value));
    	validate_store(picking, "picking");
    	component_subscribe($$self, picking, $$value => $$invalidate("$picking", $picking = $$value));
    	validate_store(tracking, "tracking");
    	component_subscribe($$self, tracking, $$value => $$invalidate("$tracking", $tracking = $$value));
    	let mounted;
    	let elements, contexts;
    	let cursorLeft = -1, cursorTop = -1;
    	let pinnedCursorLeft = -1, pinnedCursorTop = -1, pinnedCursorWidth = 10;
    	const rgb = { R: 0, G: 0, B: 0 };

    	const getAxisFromPinned = () => {
    		const [xAxis, yAxis] = $colorModel.replace($pinned, "");
    		return [xAxis, yAxis];
    	};

    	const getImageDataDimensions = () => {
    		const [xAxis, yAxis] = getAxisFromPinned();
    		const [,width] = RANGES[xAxis];
    		const [,height] = RANGES[yAxis];
    		return [width, height];
    	};

    	const getPinnedImageDataDimensions = () => {
    		const width = 1;
    		const height = RANGES[$pinned][1];
    		return [width, height];
    	};

    	const getBuffers = (w, h) => {
    		const buf = new ArrayBuffer(h * w * 4);
    		const buf8 = new Uint8ClampedArray(buf);
    		const data = new Uint32Array(buf);
    		return [buf, buf8, data];
    	};

    	const renderCanvasSize = () => {
    		elements.mounted.width = $width;
    		elements.mounted.height = $height;
    	};

    	const renderPrimaryCanvasSize = () => {
    		if ($colorModel === COLOR_MODEL_RGB) {
    			const max = RANGES.R[1];
    			elements.primary.width = max;
    			elements.primary.height = max;
    		}
    	};

    	const renderPinnedCanvasSize = () => {
    		if ($colorModel === COLOR_MODEL_RGB) {
    			const max = RANGES[$pinned][1];
    			elements.pinned.width = 1;
    			elements.pinned.height = max;
    		}
    	};

    	const render = state => {
    		if (!elements || !contexts || !state.width || !state.height || !state.pickingSwatchRgb) return;
    		const swatchRgb = state.pickingSwatchRgb;
    		renderCanvasSize();
    		renderPrimaryCanvasSize();
    		renderPinnedCanvasSize();
    		const a = 255;

    		(function renderPrimaryCanvas() {
    			var x = 0;
    			var y = 0;
    			var index = 0;
    			const [imageDataWidth, imageDataHeight] = getImageDataDimensions();
    			const imageData = contexts.primary.createImageData(imageDataWidth, imageDataHeight);
    			const [xAxis, yAxis] = getAxisFromPinned();
    			const primaryWidth = RANGES[xAxis][1];
    			const primaryHeight = RANGES[yAxis][1];
    			const xScale = state.width / primaryWidth;
    			const yScale = state.height / primaryHeight;
    			const [buf, buf8, data] = getBuffers(imageDataWidth, imageDataHeight);
    			const pinnedValue = swatchRgb[state.pinned];
    			rgb[state.pinned] = pinnedValue;

    			while (y < imageDataHeight) {
    				let yAxisValue = y;
    				rgb[yAxis] = yAxisValue;

    				while (x < imageDataWidth) {
    					let xAxisValue = x;
    					rgb[xAxis] = xAxisValue;
    					data[index] = a << 24 | rgb.B << 16 | rgb.G << 8 | rgb.R;
    					x += 1;
    					index += 1;
    				}

    				x = 0;
    				y += 1;
    			}

    			imageData.data.set(buf8);
    			contexts.primary.putImageData(imageData, 0, 0);
    			contexts.mounted.drawImage(elements.primary, 0, 0, Math.floor(primaryWidth * xScale * primaryVsPinnedThreshold), Math.floor(primaryHeight * yScale));
    			$$invalidate("cursorLeft", cursorLeft = Math.floor(swatchRgb[xAxis] * xScale * primaryVsPinnedThreshold));
    			$$invalidate("cursorTop", cursorTop = Math.floor(swatchRgb[yAxis] * yScale));
    		})();

    		(function renderPinnedCanvas() {
    			var y = 0;
    			const [pinnedWidth, pinnedHeight] = getPinnedImageDataDimensions();
    			const imageData = contexts.pinned.createImageData(pinnedWidth, pinnedHeight);
    			const yScale = state.height / pinnedHeight;
    			const [buf, buf8, data] = getBuffers(pinnedWidth, pinnedHeight);
    			const others = COLOR_MODEL_RGB.replace(state.pinned, "").split("");
    			rgb[others[0]] = swatchRgb[others[0]];
    			rgb[others[1]] = swatchRgb[others[1]];

    			while (y < pinnedHeight) {
    				rgb[state.pinned] = pinnedHeight - y;
    				data[y] = a << 24 | rgb.B << 16 | rgb.G << 8 | rgb.R;
    				y += 1;
    			}

    			imageData.data.set(buf8);
    			contexts.pinned.putImageData(imageData, 0, 0);
    			contexts.mounted.drawImage(elements.pinned, Math.floor($width * primaryVsPinnedThreshold), 0, Math.ceil($width * (1 - primaryVsPinnedThreshold)), Math.floor(pinnedHeight * yScale));
    			$$invalidate("pinnedCursorLeft", pinnedCursorLeft = Math.floor($width * primaryVsPinnedThreshold));
    			$$invalidate("pinnedCursorWidth", pinnedCursorWidth = Math.ceil($width * (1 - primaryVsPinnedThreshold)));
    			$$invalidate("pinnedCursorTop", pinnedCursorTop = (RANGES[$pinned][1] - swatchRgb[$pinned]) * yScale);
    		})();
    	};

    	let unsubscribe;

    	onMount(() => {
    		elements = {
    			mounted,
    			primary: document.createElement("canvas"),
    			pinned: document.createElement("canvas")
    		};

    		contexts = {
    			mounted: elements.mounted.getContext("2d"),
    			primary: elements.primary.getContext("2d"),
    			pinned: elements.pinned.getContext("2d")
    		};

    		const canvasStateWithSwatch = derived([canvasState, pickingSwatchRgb], ([canvasState, pickingSwatchRgb]) => {
    			return { ...canvasState, pickingSwatchRgb };
    		});

    		unsubscribe = canvasStateWithSwatch.subscribe(render);
    	});

    	onDestroy(() => {
    		unsubscribe();
    		elements = null;
    		contexts = null;
    	});

    	const getIsPrimaryCanvasEvent = e => {
    		return e.layerX < $width * primaryVsPinnedThreshold;
    	};

    	const handleCanvasSwatchEvent = (e, { isPrimaryCanvas }) => {
    		const _rgb = { ...$pickingSwatchRgb };

    		if (isPrimaryCanvas) {
    			const [xAxis, yAxis] = getAxisFromPinned();
    			let primaryXMax = RANGES[xAxis][1];
    			let primaryYMax = RANGES[yAxis][1];
    			let primaryPxWidth = $width * primaryVsPinnedThreshold;
    			let primaryPxHeight = $height;
    			let xTargetRatio = trap(e.layerX / primaryPxWidth);
    			let xTargetComponentValue = Math.round(xTargetRatio * primaryXMax);
    			_rgb[xAxis] = xTargetComponentValue;
    			let yTargetRatio = trap(e.layerY / primaryPxHeight);
    			let yTargetComponentValue = Math.round(yTargetRatio * primaryYMax);
    			_rgb[yAxis] = yTargetComponentValue;
    		} else {
    			let pinnedPxHeight = $height;
    			let pinnedYMax = RANGES[$pinned][1];
    			let yTargetRatio = trap(e.layerY / pinnedPxHeight);
    			let yTargetComponentValue = pinnedYMax - Math.round(yTargetRatio * pinnedYMax);
    			_rgb[$pinned] = yTargetComponentValue;
    		}

    		set_store_value(swatches, $swatches = $swatches.map((swatch, i) => {
    			if (i === $picking) {
    				return {
    					...swatch,
    					value: rgbToHex(_rgb.R, _rgb.G, _rgb.B)
    				};
    			} else {
    				return swatch;
    			}
    		}));
    	};

    	const handleMouseMove = e => {
    		if ($tracking) {
    			handleCanvasSwatchEvent(e, $tracking);
    		}
    	};

    	const handleMouseDown = e => {
    		const isPrimaryCanvas = getIsPrimaryCanvasEvent(e);
    		set_store_value(tracking, $tracking = { isPrimaryCanvas });
    	};

    	const handleMouseUp = e => {
    		if ($tracking) {
    			const _tracking = { ...$tracking };
    			set_store_value(tracking, $tracking = null);
    			handleCanvasSwatchEvent(e, _tracking);
    		}
    	};

    	const handleWindowResize = () => {
    		if (mounted) {
    			set_store_value(width, $width = mounted.clientWidth);
    			set_store_value(height, $height = mounted.clientHeight);
    		}
    	};

    	function canvas_elementresize_handler() {
    		$width = this.clientWidth;
    		width.set($width);
    		$height = this.clientHeight;
    		height.set($height);
    	}

    	function canvas_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate("mounted", mounted = $$value);
    		});
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("mounted" in $$props) $$invalidate("mounted", mounted = $$props.mounted);
    		if ("elements" in $$props) elements = $$props.elements;
    		if ("contexts" in $$props) contexts = $$props.contexts;
    		if ("cursorLeft" in $$props) $$invalidate("cursorLeft", cursorLeft = $$props.cursorLeft);
    		if ("cursorTop" in $$props) $$invalidate("cursorTop", cursorTop = $$props.cursorTop);
    		if ("pinnedCursorLeft" in $$props) $$invalidate("pinnedCursorLeft", pinnedCursorLeft = $$props.pinnedCursorLeft);
    		if ("pinnedCursorTop" in $$props) $$invalidate("pinnedCursorTop", pinnedCursorTop = $$props.pinnedCursorTop);
    		if ("pinnedCursorWidth" in $$props) $$invalidate("pinnedCursorWidth", pinnedCursorWidth = $$props.pinnedCursorWidth);
    		if ("unsubscribe" in $$props) unsubscribe = $$props.unsubscribe;
    		if ("$colorModel" in $$props) colorModel.set($colorModel = $$props.$colorModel);
    		if ("$pinned" in $$props) pinned.set($pinned = $$props.$pinned);
    		if ("$width" in $$props) width.set($width = $$props.$width);
    		if ("$height" in $$props) height.set($height = $$props.$height);
    		if ("$pickingSwatchRgb" in $$props) pickingSwatchRgb.set($pickingSwatchRgb = $$props.$pickingSwatchRgb);
    		if ("$swatches" in $$props) swatches.set($swatches = $$props.$swatches);
    		if ("$picking" in $$props) picking.set($picking = $$props.$picking);
    		if ("$tracking" in $$props) tracking.set($tracking = $$props.$tracking);
    	};

    	return {
    		mounted,
    		cursorLeft,
    		cursorTop,
    		pinnedCursorLeft,
    		pinnedCursorTop,
    		pinnedCursorWidth,
    		handleMouseMove,
    		handleMouseDown,
    		handleMouseUp,
    		handleWindowResize,
    		$width,
    		$height,
    		canvas_elementresize_handler,
    		canvas_binding
    	};
    }

    class PickerCanvas extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PickerCanvas",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/PinnedRadios.svelte generated by Svelte v3.15.0 */
    const file$9 = "src/PinnedRadios.svelte";

    // (45:0) {#if $pickingSwatchRgb}
    function create_if_block$2(ctx) {
    	let div;
    	let label0;
    	let input0;
    	let t0;
    	let t1_value = ctx.$pickingSwatchRgb.R + "";
    	let t1;
    	let t2;
    	let label1;
    	let input1;
    	let t3;
    	let t4_value = ctx.$pickingSwatchRgb.G + "";
    	let t4;
    	let t5;
    	let label2;
    	let input2;
    	let t6;
    	let t7_value = ctx.$pickingSwatchRgb.B + "";
    	let t7;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label0 = element("label");
    			input0 = element("input");
    			t0 = text("\n    R: ");
    			t1 = text(t1_value);
    			t2 = space();
    			label1 = element("label");
    			input1 = element("input");
    			t3 = text("\n    G: ");
    			t4 = text(t4_value);
    			t5 = space();
    			label2 = element("label");
    			input2 = element("input");
    			t6 = text("\n    B: ");
    			t7 = text(t7_value);
    			attr_dev(input0, "type", "radio");
    			input0.__value = "R";
    			input0.value = input0.__value;
    			attr_dev(input0, "class", "svelte-1xfk6xs");
    			ctx.$$binding_groups[0].push(input0);
    			add_location(input0, file$9, 47, 4, 902);
    			attr_dev(label0, "class", "svelte-1xfk6xs");
    			add_location(label0, file$9, 46, 2, 890);
    			attr_dev(input1, "type", "radio");
    			input1.__value = "G";
    			input1.value = input1.__value;
    			attr_dev(input1, "class", "svelte-1xfk6xs");
    			ctx.$$binding_groups[0].push(input1);
    			add_location(input1, file$9, 52, 4, 1009);
    			attr_dev(label1, "class", "svelte-1xfk6xs");
    			add_location(label1, file$9, 51, 2, 997);
    			attr_dev(input2, "type", "radio");
    			input2.__value = "B";
    			input2.value = input2.__value;
    			attr_dev(input2, "class", "svelte-1xfk6xs");
    			ctx.$$binding_groups[0].push(input2);
    			add_location(input2, file$9, 57, 4, 1116);
    			attr_dev(label2, "class", "svelte-1xfk6xs");
    			add_location(label2, file$9, 56, 2, 1104);
    			attr_dev(div, "class", "svelte-1xfk6xs");
    			add_location(div, file$9, 45, 0, 882);

    			dispose = [
    				listen_dev(input0, "change", ctx.input0_change_handler),
    				listen_dev(input1, "change", ctx.input1_change_handler),
    				listen_dev(input2, "change", ctx.input2_change_handler)
    			];
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label0);
    			append_dev(label0, input0);
    			input0.checked = input0.__value === ctx.$pinned;
    			append_dev(label0, t0);
    			append_dev(label0, t1);
    			append_dev(div, t2);
    			append_dev(div, label1);
    			append_dev(label1, input1);
    			input1.checked = input1.__value === ctx.$pinned;
    			append_dev(label1, t3);
    			append_dev(label1, t4);
    			append_dev(div, t5);
    			append_dev(div, label2);
    			append_dev(label2, input2);
    			input2.checked = input2.__value === ctx.$pinned;
    			append_dev(label2, t6);
    			append_dev(label2, t7);
    		},
    		p: function update(changed, ctx) {
    			if (changed.$pinned) {
    				input0.checked = input0.__value === ctx.$pinned;
    			}

    			if (changed.$pickingSwatchRgb && t1_value !== (t1_value = ctx.$pickingSwatchRgb.R + "")) set_data_dev(t1, t1_value);

    			if (changed.$pinned) {
    				input1.checked = input1.__value === ctx.$pinned;
    			}

    			if (changed.$pickingSwatchRgb && t4_value !== (t4_value = ctx.$pickingSwatchRgb.G + "")) set_data_dev(t4, t4_value);

    			if (changed.$pinned) {
    				input2.checked = input2.__value === ctx.$pinned;
    			}

    			if (changed.$pickingSwatchRgb && t7_value !== (t7_value = ctx.$pickingSwatchRgb.B + "")) set_data_dev(t7, t7_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			ctx.$$binding_groups[0].splice(ctx.$$binding_groups[0].indexOf(input0), 1);
    			ctx.$$binding_groups[0].splice(ctx.$$binding_groups[0].indexOf(input1), 1);
    			ctx.$$binding_groups[0].splice(ctx.$$binding_groups[0].indexOf(input2), 1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(45:0) {#if $pickingSwatchRgb}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let if_block_anchor;
    	let if_block = ctx.$pickingSwatchRgb && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(changed, ctx) {
    			if (ctx.$pickingSwatchRgb) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $pickingSwatchRgb;
    	let $pinned;
    	validate_store(pickingSwatchRgb, "pickingSwatchRgb");
    	component_subscribe($$self, pickingSwatchRgb, $$value => $$invalidate("$pickingSwatchRgb", $pickingSwatchRgb = $$value));
    	validate_store(pinned, "pinned");
    	component_subscribe($$self, pinned, $$value => $$invalidate("$pinned", $pinned = $$value));
    	const $$binding_groups = [[]];

    	function input0_change_handler() {
    		$pinned = this.__value;
    		pinned.set($pinned);
    	}

    	function input1_change_handler() {
    		$pinned = this.__value;
    		pinned.set($pinned);
    	}

    	function input2_change_handler() {
    		$pinned = this.__value;
    		pinned.set($pinned);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("$pickingSwatchRgb" in $$props) pickingSwatchRgb.set($pickingSwatchRgb = $$props.$pickingSwatchRgb);
    		if ("$pinned" in $$props) pinned.set($pinned = $$props.$pinned);
    	};

    	return {
    		$pickingSwatchRgb,
    		$pinned,
    		input0_change_handler,
    		input1_change_handler,
    		input2_change_handler,
    		$$binding_groups
    	};
    }

    class PinnedRadios extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PinnedRadios",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    function isValidHex(possibleHex) {
      return longHex.test(possibleHex) || shortHex.test(possibleHex);
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src/Modal.svelte generated by Svelte v3.15.0 */

    const { console: console_1 } = globals;
    const file$a = "src/Modal.svelte";

    function create_fragment$b(ctx) {
    	let div2;
    	let div0;
    	let div0_intro;
    	let div0_outro;
    	let t;
    	let div1;
    	let div1_intro;
    	let div1_outro;
    	let current;
    	let dispose;
    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "style", ctx.overlayStyle);
    			attr_dev(div0, "class", "overlay svelte-7gpej3");
    			add_location(div0, file$a, 97, 2, 2688);
    			attr_dev(div1, "class", "modal svelte-7gpej3");
    			add_location(div1, file$a, 104, 2, 2941);
    			attr_dev(div2, "class", "overlay-overflow svelte-7gpej3");
    			add_location(div2, file$a, 96, 0, 2655);
    			dispose = listen_dev(window, "keyup", ctx.handleKeyUp, false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(changed, ctx) {
    			if (!current || changed.overlayStyle) {
    				attr_dev(div0, "style", ctx.overlayStyle);
    			}

    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(get_slot_changes(default_slot_template, ctx, changed, null), get_slot_context(default_slot_template, ctx, null));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div0_outro) div0_outro.end(1);

    				if (!div0_intro) div0_intro = create_in_transition(div0, swatchScale, {
    					...ctx.transitionSwatchScale,
    					duration: ctx.duration1
    				});

    				div0_intro.start();
    			});

    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);

    				if (!div1_intro) div1_intro = create_in_transition(div1, fly, {
    					delay: ctx.duration1 - ctx.effectOverlap,
    					duration: ctx.duration2,
    					x: ctx.targetWidth / 10,
    					y: 0,
    					opacity: 0,
    					easing: quintOut
    				});

    				div1_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div0_intro) div0_intro.invalidate();

    			div0_outro = create_out_transition(div0, swatchScaleOut, {
    				...ctx.transitionSwatchScale,
    				delay: ctx.duration2 - ctx.effectOverlap,
    				duration: ctx.duration1
    			});

    			transition_out(default_slot, local);
    			if (div1_intro) div1_intro.invalidate();

    			div1_outro = create_out_transition(div1, fly, {
    				delay: 0,
    				duration: ctx.duration2,
    				x: ctx.targetWidth / 10,
    				y: 0,
    				opacity: 0,
    				easing: quintOut
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching && div0_outro) div0_outro.end();
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div1_outro) div1_outro.end();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function renderTransformStyles(s, p) {
    	const styles = `
      transform: scale(${s.x}, ${s.y}) translate(${p.x}px, ${p.y}px);
      `.trim();

    	return styles;
    }

    function swatchScale(node, { duration, scale, position, reverse }) {
    	console.log("swatchScale called", { duration, scale, position, reverse });

    	const css = t => {
    		console.log("t", t);
    		t = cubicOut(t);

    		const s = {
    			x: scale.start.x + Math.abs(scale.start.x - scale.end.x) * t,
    			y: scale.start.y + Math.abs(scale.start.y - scale.end.y) * t
    		};

    		const p = {
    			x: Math.abs((position.end.x - position.start.x) * (1 - t)) / s.x,
    			y: Math.abs((position.end.y - position.start.y) * (1 - t)) / s.y
    		};

    		return `${renderTransformStyles(s, p)};`;
    	};

    	return { duration, css };
    }

    function swatchScaleOut(node, options) {
    	console.log("swatch scale out called");
    	return swatchScale(node, { ...options, reverse: true });
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { targetHeight = 0 } = $$props;
    	let { targetWidth = 0 } = $$props;
    	let { background = "" } = $$props;
    	let { dimensions } = $$props;
    	let { duration1 = 2000 } = $$props;
    	let { duration2 = 1500 } = $$props;
    	let { effectOverlap = 0 } = $$props;
    	let { handleEscapeKey } = $$props;

    	const handleKeyUp = e => {
    		if (e.code === "Escape") handleEscapeKey();
    	};

    	const writable_props = [
    		"targetHeight",
    		"targetWidth",
    		"background",
    		"dimensions",
    		"duration1",
    		"duration2",
    		"effectOverlap",
    		"handleEscapeKey"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("targetHeight" in $$props) $$invalidate("targetHeight", targetHeight = $$props.targetHeight);
    		if ("targetWidth" in $$props) $$invalidate("targetWidth", targetWidth = $$props.targetWidth);
    		if ("background" in $$props) $$invalidate("background", background = $$props.background);
    		if ("dimensions" in $$props) $$invalidate("dimensions", dimensions = $$props.dimensions);
    		if ("duration1" in $$props) $$invalidate("duration1", duration1 = $$props.duration1);
    		if ("duration2" in $$props) $$invalidate("duration2", duration2 = $$props.duration2);
    		if ("effectOverlap" in $$props) $$invalidate("effectOverlap", effectOverlap = $$props.effectOverlap);
    		if ("handleEscapeKey" in $$props) $$invalidate("handleEscapeKey", handleEscapeKey = $$props.handleEscapeKey);
    		if ("$$scope" in $$props) $$invalidate("$$scope", $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return {
    			targetHeight,
    			targetWidth,
    			background,
    			dimensions,
    			duration1,
    			duration2,
    			effectOverlap,
    			handleEscapeKey,
    			transitionSwatchScale,
    			overlayStyle
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("targetHeight" in $$props) $$invalidate("targetHeight", targetHeight = $$props.targetHeight);
    		if ("targetWidth" in $$props) $$invalidate("targetWidth", targetWidth = $$props.targetWidth);
    		if ("background" in $$props) $$invalidate("background", background = $$props.background);
    		if ("dimensions" in $$props) $$invalidate("dimensions", dimensions = $$props.dimensions);
    		if ("duration1" in $$props) $$invalidate("duration1", duration1 = $$props.duration1);
    		if ("duration2" in $$props) $$invalidate("duration2", duration2 = $$props.duration2);
    		if ("effectOverlap" in $$props) $$invalidate("effectOverlap", effectOverlap = $$props.effectOverlap);
    		if ("handleEscapeKey" in $$props) $$invalidate("handleEscapeKey", handleEscapeKey = $$props.handleEscapeKey);
    		if ("transitionSwatchScale" in $$props) $$invalidate("transitionSwatchScale", transitionSwatchScale = $$props.transitionSwatchScale);
    		if ("overlayStyle" in $$props) $$invalidate("overlayStyle", overlayStyle = $$props.overlayStyle);
    	};

    	let transitionSwatchScale;
    	let overlayStyle;

    	$$self.$$.update = (changed = { dimensions: 1, targetWidth: 1, targetHeight: 1, background: 1 }) => {
    		if (changed.dimensions || changed.targetWidth || changed.targetHeight) {
    			 $$invalidate("transitionSwatchScale", transitionSwatchScale = dimensions
    			? {
    					position: {
    						start: {
    							x: dimensions.offsetLeft,
    							y: dimensions.offsetTop
    						},
    						end: { x: 0, y: 0 }
    					},
    					scale: {
    						start: {
    							x: dimensions.offsetWidth / targetWidth,
    							y: dimensions.offsetHeight / targetHeight
    						},
    						end: { x: 1, y: 1 }
    					}
    				}
    			: null);
    		}

    		if (changed.targetWidth || changed.targetHeight || changed.background) {
    			 $$invalidate("overlayStyle", overlayStyle = [
    				`width:  ${targetWidth}px`,
    				`height: ${targetHeight}px`,
    				`background: ${background}`
    			].join("; "));
    		}
    	};

    	return {
    		targetHeight,
    		targetWidth,
    		background,
    		dimensions,
    		duration1,
    		duration2,
    		effectOverlap,
    		handleEscapeKey,
    		handleKeyUp,
    		transitionSwatchScale,
    		overlayStyle,
    		$$slots,
    		$$scope
    	};
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$b, safe_not_equal, {
    			targetHeight: 0,
    			targetWidth: 0,
    			background: 0,
    			dimensions: 0,
    			duration1: 0,
    			duration2: 0,
    			effectOverlap: 0,
    			handleEscapeKey: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (ctx.dimensions === undefined && !("dimensions" in props)) {
    			console_1.warn("<Modal> was created without expected prop 'dimensions'");
    		}

    		if (ctx.handleEscapeKey === undefined && !("handleEscapeKey" in props)) {
    			console_1.warn("<Modal> was created without expected prop 'handleEscapeKey'");
    		}
    	}

    	get targetHeight() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set targetHeight(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get targetWidth() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set targetWidth(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get background() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set background(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dimensions() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dimensions(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration1() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration1(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration2() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration2(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get effectOverlap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set effectOverlap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleEscapeKey() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleEscapeKey(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    /* src/Picker.svelte generated by Svelte v3.15.0 */
    const file$b = "src/Picker.svelte";

    // (127:0) {#if isOpen }
    function create_if_block$3(ctx) {
    	let current;

    	const modal = new Modal({
    			props: {
    				targetWidth: ctx.width,
    				targetHeight: ctx.height,
    				dimensions: ctx.previousOriginElementDimensions,
    				background: ctx.background,
    				duration1: ctx.duration1,
    				duration2: ctx.duration2,
    				effectOverlap: ctx.effectOverlap,
    				handleEscapeKey: ctx.handleEscapeKey,
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const modal_changes = {};
    			if (changed.width) modal_changes.targetWidth = ctx.width;
    			if (changed.height) modal_changes.targetHeight = ctx.height;
    			if (changed.previousOriginElementDimensions) modal_changes.dimensions = ctx.previousOriginElementDimensions;
    			if (changed.background) modal_changes.background = ctx.background;

    			if (changed.$$scope || changed.backgroundColor || changed.previousBackgroundColor || changed.contrastingColor || changed.$tracking || changed.removeHref || changed.value) {
    				modal_changes.$$scope = { changed, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(127:0) {#if isOpen }",
    		ctx
    	});

    	return block;
    }

    // (149:6) <ButtonLink href={removeHref} class='swatch-action' on:click={handleRemoveButton}>
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Remove");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(149:6) <ButtonLink href={removeHref} class='swatch-action' on:click={handleRemoveButton}>",
    		ctx
    	});

    	return block;
    }

    // (152:6) <Button on:click={handleCloseButton}>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Close");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(152:6) <Button on:click={handleCloseButton}>",
    		ctx
    	});

    	return block;
    }

    // (148:4) <ActionBar>
    function create_default_slot_1$1(ctx) {
    	let t;
    	let current;

    	const buttonlink = new ButtonLink({
    			props: {
    				href: ctx.removeHref,
    				class: "swatch-action",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	buttonlink.$on("click", ctx.handleRemoveButton);

    	const button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", ctx.handleCloseButton);

    	const block = {
    		c: function create() {
    			create_component(buttonlink.$$.fragment);
    			t = space();
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(buttonlink, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const buttonlink_changes = {};
    			if (changed.removeHref) buttonlink_changes.href = ctx.removeHref;

    			if (changed.$$scope) {
    				buttonlink_changes.$$scope = { changed, ctx };
    			}

    			buttonlink.$set(buttonlink_changes);
    			const button_changes = {};

    			if (changed.$$scope) {
    				button_changes.$$scope = { changed, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttonlink.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttonlink.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buttonlink, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(148:4) <ActionBar>",
    		ctx
    	});

    	return block;
    }

    // (128:0) <Modal   targetWidth={width}   targetHeight={height}   dimensions={previousOriginElementDimensions}   background={background}   duration1={duration1}   duration2={duration2}   effectOverlap={effectOverlap}   handleEscapeKey={handleEscapeKey} >
    function create_default_slot$2(ctx) {
    	let div;
    	let input;
    	let t0;
    	let t1;
    	let t2;
    	let current;
    	let dispose;

    	const actionbar = new ActionBar({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const pinnedradios = new PinnedRadios({ $$inline: true });
    	const pickercanvas = new PickerCanvas({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			create_component(actionbar.$$.fragment);
    			t1 = space();
    			create_component(pinnedradios.$$.fragment);
    			t2 = space();
    			create_component(pickercanvas.$$.fragment);
    			attr_dev(input, "type", "text");
    			set_style(input, "color", ctx.contrastingColor);
    			set_style(input, "border-color", ctx.contrastingColor);
    			attr_dev(input, "class", "svelte-16cjsbm");
    			add_location(input, file$b, 142, 4, 3550);
    			attr_dev(div, "class", "picker svelte-16cjsbm");
    			set_style(div, "background", ctx.backgroundColor || ctx.previousBackgroundColor);
    			set_style(div, "color", ctx.contrastingColor);
    			toggle_class(div, "tracking", ctx.$tracking);
    			add_location(div, file$b, 137, 2, 3390);
    			dispose = listen_dev(input, "input", ctx.input_input_handler);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, ctx.value);
    			append_dev(div, t0);
    			mount_component(actionbar, div, null);
    			append_dev(div, t1);
    			mount_component(pinnedradios, div, null);
    			append_dev(div, t2);
    			mount_component(pickercanvas, div, null);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			if (!current || changed.contrastingColor) {
    				set_style(input, "color", ctx.contrastingColor);
    			}

    			if (!current || changed.contrastingColor) {
    				set_style(input, "border-color", ctx.contrastingColor);
    			}

    			if (changed.value && input.value !== ctx.value) {
    				set_input_value(input, ctx.value);
    			}

    			const actionbar_changes = {};

    			if (changed.$$scope || changed.removeHref) {
    				actionbar_changes.$$scope = { changed, ctx };
    			}

    			actionbar.$set(actionbar_changes);

    			if (!current || (changed.backgroundColor || changed.previousBackgroundColor)) {
    				set_style(div, "background", ctx.backgroundColor || ctx.previousBackgroundColor);
    			}

    			if (!current || changed.contrastingColor) {
    				set_style(div, "color", ctx.contrastingColor);
    			}

    			if (changed.$tracking) {
    				toggle_class(div, "tracking", ctx.$tracking);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbar.$$.fragment, local);
    			transition_in(pinnedradios.$$.fragment, local);
    			transition_in(pickercanvas.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbar.$$.fragment, local);
    			transition_out(pinnedradios.$$.fragment, local);
    			transition_out(pickercanvas.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(actionbar);
    			destroy_component(pinnedradios);
    			destroy_component(pickercanvas);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(128:0) <Modal   targetWidth={width}   targetHeight={height}   dimensions={previousOriginElementDimensions}   background={background}   duration1={duration1}   duration2={duration2}   effectOverlap={effectOverlap}   handleEscapeKey={handleEscapeKey} >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let html_tag;
    	let raw_value = `<style>html { background: ${ctx.backgroundColor || ctx.previousBackgroundColor} }</style>` + "";
    	let html_anchor;
    	let t;
    	let if_block_anchor;
    	let current;
    	let if_block = ctx.isOpen && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			html_anchor = empty();
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			html_tag = new HtmlTag(raw_value, null);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(document.head);
    			append_dev(document.head, html_anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			if ((!current || (changed.backgroundColor || changed.previousBackgroundColor)) && raw_value !== (raw_value = `<style>html { background: ${ctx.backgroundColor || ctx.previousBackgroundColor} }</style>` + "")) html_tag.p(raw_value);

    			if (ctx.isOpen) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const timeScale = 1;

    function instance$b($$self, $$props, $$invalidate) {
    	let $swatches;
    	let $picking;
    	let $swatchesDimensions;
    	let $pickingSwatch;
    	let $tracking;
    	validate_store(swatches, "swatches");
    	component_subscribe($$self, swatches, $$value => $$invalidate("$swatches", $swatches = $$value));
    	validate_store(picking, "picking");
    	component_subscribe($$self, picking, $$value => $$invalidate("$picking", $picking = $$value));
    	validate_store(swatchesDimensions, "swatchesDimensions");
    	component_subscribe($$self, swatchesDimensions, $$value => $$invalidate("$swatchesDimensions", $swatchesDimensions = $$value));
    	validate_store(pickingSwatch, "pickingSwatch");
    	component_subscribe($$self, pickingSwatch, $$value => $$invalidate("$pickingSwatch", $pickingSwatch = $$value));
    	validate_store(tracking, "tracking");
    	component_subscribe($$self, tracking, $$value => $$invalidate("$tracking", $tracking = $$value));
    	let { width = 0 } = $$props;
    	let { height = 0 } = $$props;
    	let value = $pickingSwatch.value;
    	let isOpen = true;
    	const duration1 = 200 * timeScale;
    	const duration2 = 150 * timeScale;
    	const effectOverlap = 50 * timeScale;

    	let unsub = pickingSwatch.subscribe(swatch => {
    		if (swatch && swatch.value !== value) {
    			$$invalidate("value", value = swatch.value);
    		}
    	});

    	onDestroy(() => {
    		unsub();
    	});

    	const close = () => {
    		$$invalidate("isOpen", isOpen = false);
    		return delay(duration1 + duration2 - effectOverlap + 1);
    	};

    	const handleEscapeKey = () => {
    		close().then(cancelPicking);
    	};

    	const handleRemoveButton = e => {
    		e.preventDefault();
    		const href = e.target.href;

    		close().then(() => {
    			cancelPicking();
    			location.href = href;
    		});
    	};

    	const handleCloseButton = e => {
    		e.preventDefault();
    		close().then(cancelPicking);
    	};

    	const writable_props = ["width", "height"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Picker> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate("value", value);
    	}

    	$$self.$set = $$props => {
    		if ("width" in $$props) $$invalidate("width", width = $$props.width);
    		if ("height" in $$props) $$invalidate("height", height = $$props.height);
    	};

    	$$self.$capture_state = () => {
    		return {
    			width,
    			height,
    			value,
    			isOpen,
    			unsub,
    			backgroundColor,
    			$swatches,
    			$picking,
    			previousBackgroundColor,
    			background,
    			contrastingColor,
    			originElementDimensions,
    			$swatchesDimensions,
    			previousOriginElementDimensions,
    			$pickingSwatch,
    			removeHref,
    			$tracking
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("width" in $$props) $$invalidate("width", width = $$props.width);
    		if ("height" in $$props) $$invalidate("height", height = $$props.height);
    		if ("value" in $$props) $$invalidate("value", value = $$props.value);
    		if ("isOpen" in $$props) $$invalidate("isOpen", isOpen = $$props.isOpen);
    		if ("unsub" in $$props) unsub = $$props.unsub;
    		if ("backgroundColor" in $$props) $$invalidate("backgroundColor", backgroundColor = $$props.backgroundColor);
    		if ("$swatches" in $$props) swatches.set($swatches = $$props.$swatches);
    		if ("$picking" in $$props) picking.set($picking = $$props.$picking);
    		if ("previousBackgroundColor" in $$props) $$invalidate("previousBackgroundColor", previousBackgroundColor = $$props.previousBackgroundColor);
    		if ("background" in $$props) $$invalidate("background", background = $$props.background);
    		if ("contrastingColor" in $$props) $$invalidate("contrastingColor", contrastingColor = $$props.contrastingColor);
    		if ("originElementDimensions" in $$props) $$invalidate("originElementDimensions", originElementDimensions = $$props.originElementDimensions);
    		if ("$swatchesDimensions" in $$props) swatchesDimensions.set($swatchesDimensions = $$props.$swatchesDimensions);
    		if ("previousOriginElementDimensions" in $$props) $$invalidate("previousOriginElementDimensions", previousOriginElementDimensions = $$props.previousOriginElementDimensions);
    		if ("$pickingSwatch" in $$props) pickingSwatch.set($pickingSwatch = $$props.$pickingSwatch);
    		if ("removeHref" in $$props) $$invalidate("removeHref", removeHref = $$props.removeHref);
    		if ("$tracking" in $$props) tracking.set($tracking = $$props.$tracking);
    	};

    	let backgroundColor;
    	let previousBackgroundColor;
    	let background;
    	let contrastingColor;
    	let originElementDimensions;
    	let previousOriginElementDimensions;
    	let removeHref;

    	$$self.$$.update = (changed = { value: 1, $pickingSwatch: 1, $picking: 1, $swatches: 1, previousBackgroundColor: 1, backgroundColor: 1, $swatchesDimensions: 1, originElementDimensions: 1, previousOriginElementDimensions: 1 }) => {
    		if (changed.value || changed.$pickingSwatch || changed.$picking) {
    			 {
    				if (isValidHex(value) && $pickingSwatch) {
    					set_store_value(swatches, $swatches[$picking].value = value, $swatches);
    				}
    			}
    		}

    		if (changed.$swatches || changed.$picking) {
    			 $$invalidate("backgroundColor", backgroundColor = $swatches[$picking] && $swatches[$picking].value);
    		}

    		if (changed.$swatches || changed.$picking || changed.previousBackgroundColor) {
    			 $$invalidate("previousBackgroundColor", previousBackgroundColor = $swatches[$picking]
    			? $swatches[$picking].value
    			: previousBackgroundColor);
    		}

    		if (changed.previousBackgroundColor) {
    			 $$invalidate("background", background = previousBackgroundColor);
    		}

    		if (changed.backgroundColor || changed.previousBackgroundColor) {
    			 $$invalidate("contrastingColor", contrastingColor = getHighContrastColorFromHex(backgroundColor || previousBackgroundColor));
    		}

    		if (changed.$swatchesDimensions || changed.$picking) {
    			 $$invalidate("originElementDimensions", originElementDimensions = $swatchesDimensions[$picking]);
    		}

    		if (changed.originElementDimensions || changed.previousOriginElementDimensions) {
    			 $$invalidate("previousOriginElementDimensions", previousOriginElementDimensions = originElementDimensions || previousOriginElementDimensions);
    		}

    		if (changed.$swatches || changed.$picking) {
    			 $$invalidate("removeHref", removeHref = renderHash({
    				swatches: $swatches.filter((s, j) => {
    					return $picking !== j;
    				})
    			}));
    		}
    	};

    	return {
    		width,
    		height,
    		value,
    		isOpen,
    		duration1,
    		duration2,
    		effectOverlap,
    		handleEscapeKey,
    		handleRemoveButton,
    		handleCloseButton,
    		backgroundColor,
    		previousBackgroundColor,
    		background,
    		contrastingColor,
    		previousOriginElementDimensions,
    		removeHref,
    		$tracking,
    		input_input_handler
    	};
    }

    class Picker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$c, safe_not_equal, { width: 0, height: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Picker",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get width() {
    		throw new Error("<Picker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Picker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Picker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Picker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.15.0 */
    const file$c = "src/App.svelte";

    // (26:2) {#if hasPicker}
    function create_if_block$4(ctx) {
    	let current;

    	const picker = new Picker({
    			props: { width: ctx.width, height: ctx.height },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(picker.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(picker, target, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const picker_changes = {};
    			if (changed.width) picker_changes.width = ctx.width;
    			if (changed.height) picker_changes.height = ctx.height;
    			picker.$set(picker_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(picker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(picker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(picker, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(26:2) {#if hasPicker}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;
    	let span;
    	let t3;
    	let div_resize_listener;
    	let current;
    	const header = new Header({ $$inline: true });
    	const swatches = new Swatches({ $$inline: true });
    	let if_block = ctx.hasPicker && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(header.$$.fragment);
    			t0 = space();
    			create_component(swatches.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			span = element("span");
    			t3 = text(ctx.debuggingOutput);
    			attr_dev(span, "id", "alive");
    			attr_dev(span, "class", "svelte-k3qegc");
    			add_location(span, file$c, 28, 2, 757);
    			attr_dev(div, "class", "app svelte-k3qegc");
    			add_render_callback(() => ctx.div_elementresize_handler.call(div));
    			add_location(div, file$c, 22, 0, 586);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(header, div, null);
    			append_dev(div, t0);
    			mount_component(swatches, div, null);
    			append_dev(div, t1);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t2);
    			append_dev(div, span);
    			append_dev(span, t3);
    			div_resize_listener = add_resize_listener(div, ctx.div_elementresize_handler.bind(div));
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			if (ctx.hasPicker) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t2);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || changed.debuggingOutput) set_data_dev(t3, ctx.debuggingOutput);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(swatches.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(swatches.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(header);
    			destroy_component(swatches);
    			if (if_block) if_block.d();
    			div_resize_listener.cancel();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $picking;
    	let $swatchesDimensionsIsReady;
    	validate_store(picking, "picking");
    	component_subscribe($$self, picking, $$value => $$invalidate("$picking", $picking = $$value));
    	validate_store(swatchesDimensionsIsReady, "swatchesDimensionsIsReady");
    	component_subscribe($$self, swatchesDimensionsIsReady, $$value => $$invalidate("$swatchesDimensionsIsReady", $swatchesDimensionsIsReady = $$value));
    	let width = 0;
    	let height = 0;

    	function div_elementresize_handler() {
    		width = this.offsetWidth;
    		height = this.offsetHeight;
    		$$invalidate("width", width);
    		$$invalidate("height", height);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("width" in $$props) $$invalidate("width", width = $$props.width);
    		if ("height" in $$props) $$invalidate("height", height = $$props.height);
    		if ("hasPicker" in $$props) $$invalidate("hasPicker", hasPicker = $$props.hasPicker);
    		if ("$picking" in $$props) picking.set($picking = $$props.$picking);
    		if ("$swatchesDimensionsIsReady" in $$props) swatchesDimensionsIsReady.set($swatchesDimensionsIsReady = $$props.$swatchesDimensionsIsReady);
    		if ("debuggingOutput" in $$props) $$invalidate("debuggingOutput", debuggingOutput = $$props.debuggingOutput);
    	};

    	let hasPicker;
    	let debuggingOutput;

    	$$self.$$.update = (changed = { $picking: 1, $swatchesDimensionsIsReady: 1, hasPicker: 1 }) => {
    		if (changed.$picking || changed.$swatchesDimensionsIsReady) {
    			 $$invalidate("hasPicker", hasPicker = $picking !== null && $swatchesDimensionsIsReady);
    		}

    		if (changed.$swatchesDimensionsIsReady || changed.$picking || changed.hasPicker) {
    			 $$invalidate("debuggingOutput", debuggingOutput = JSON.stringify({
    				swatchesDimensionsIsReady: $swatchesDimensionsIsReady,
    				$picking,
    				hasPicker
    			}));
    		}
    	};

    	return {
    		width,
    		height,
    		hasPicker,
    		debuggingOutput,
    		div_elementresize_handler
    	};
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    /**
     * lodash (Custom Build) <https://lodash.com/>
     * Build: `lodash modularize exports="npm" -o ./`
     * Copyright jQuery Foundation and other contributors <https://jquery.org/>
     * Released under MIT license <https://lodash.com/license>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     */

    /** Used as the `TypeError` message for "Functions" methods. */
    var FUNC_ERROR_TEXT = 'Expected a function';

    /** Used as references for various `Number` constants. */
    var NAN = 0 / 0;

    /** `Object#toString` result references. */
    var symbolTag = '[object Symbol]';

    /** Used to match leading and trailing whitespace. */
    var reTrim = /^\s+|\s+$/g;

    /** Used to detect bad signed hexadecimal string values. */
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

    /** Used to detect binary string values. */
    var reIsBinary = /^0b[01]+$/i;

    /** Used to detect octal string values. */
    var reIsOctal = /^0o[0-7]+$/i;

    /** Built-in method references without a dependency on `root`. */
    var freeParseInt = parseInt;

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function('return this')();

    /** Used for built-in method references. */
    var objectProto = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString = objectProto.toString;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeMax = Math.max,
        nativeMin = Math.min;

    /**
     * Gets the timestamp of the number of milliseconds that have elapsed since
     * the Unix epoch (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Date
     * @returns {number} Returns the timestamp.
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => Logs the number of milliseconds it took for the deferred invocation.
     */
    var now$1 = function() {
      return root.Date.now();
    };

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * Provide `options` to indicate whether `func` should be invoked on the
     * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
     * with the last arguments provided to the debounced function. Subsequent
     * calls to the debounced function return the result of the last `func`
     * invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the debounced function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=false]
     *  Specify invoking on the leading edge of the timeout.
     * @param {number} [options.maxWait]
     *  The maximum time `func` is allowed to be delayed before it's invoked.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel);
     */
    function debounce(func, wait, options) {
      var lastArgs,
          lastThis,
          maxWait,
          result,
          timerId,
          lastCallTime,
          lastInvokeTime = 0,
          leading = false,
          maxing = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = toNumber(wait) || 0;
      if (isObject(options)) {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function invokeFunc(time) {
        var args = lastArgs,
            thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
      }

      function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
      }

      function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime,
            result = wait - timeSinceLastCall;

        return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
      }

      function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
          (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
      }

      function timerExpired() {
        var time = now$1();
        if (shouldInvoke(time)) {
          return trailingEdge(time);
        }
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
      }

      function trailingEdge(time) {
        timerId = undefined;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) {
          return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
      }

      function cancel() {
        if (timerId !== undefined) {
          clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
      }

      function flush() {
        return timerId === undefined ? result : trailingEdge(now$1());
      }

      function debounced() {
        var time = now$1(),
            isInvoking = shouldInvoke(time);

        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
          if (timerId === undefined) {
            return leadingEdge(lastCallTime);
          }
          if (maxing) {
            // Handle invocations in a tight loop.
            timerId = setTimeout(timerExpired, wait);
            return invokeFunc(lastCallTime);
          }
        }
        if (timerId === undefined) {
          timerId = setTimeout(timerExpired, wait);
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed `func` invocations and a `flush` method to
     * immediately invoke them. Provide `options` to indicate whether `func`
     * should be invoked on the leading and/or trailing edge of the `wait`
     * timeout. The `func` is invoked with the last arguments provided to the
     * throttled function. Subsequent calls to the throttled function return the
     * result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the throttled function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=true]
     *  Specify invoking on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // Avoid excessively updating the position while scrolling.
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
     * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
     * jQuery(element).on('click', throttled);
     *
     * // Cancel the trailing throttled invocation.
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, {
        'leading': leading,
        'maxWait': wait,
        'trailing': trailing
      });
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == 'object' || type == 'function');
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return !!value && typeof value == 'object';
    }

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && objectToString.call(value) == symbolTag);
    }

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, '');
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    var lodash_throttle = throttle;

    const syncURLtoState = memoize(function _syncURLtoState(url) {
      const newState = parseURL(url);
      if (newState) {
        swatches.set(newState.swatches);
        picking.set(newState.picking);
        return true;
      }
    });

    if (!syncURLtoState(location.href)) {
      location.hash = toString({
        swatches: get_store_value(swatches),
        picking: get_store_value(picking)
      });
    }

    const derivedLocationHash = derived(
      [swatches, picking],
      ([$swatches, $picking]) => {
        return renderHash({
          swatches: $swatches,
          picking: $picking
        });
      }
    );

    const handleDerivedLocationHash = lodash_throttle(
      hash => {
        if (hash !== location.hash) {
          location.hash = hash;
        }
      },
      1000,
      { leading: true, trailing: true }
    );

    derivedLocationHash.subscribe(handleDerivedLocationHash);

    const handleHashChange = e => {
      syncURLtoState(e.newURL);
    };

    window.addEventListener('hashchange', handleHashChange, false);

    var main = new App({ target: document.body });

    return main;

}());
//# sourceMappingURL=bundle.js.map
