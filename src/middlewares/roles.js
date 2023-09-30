export const isSuperAdmin = (req, res, next) => {
    const { role } = req.user;console.log(role)

    if (!/^Super(?: |-|_)?Admin$/i.test(role)) {
        res.set('WWW-Authenticate', 'Bearer realm="", error="insufficient_scope"');
        return res.status(403).json({ error: 'Super admin role needed' });
    }

    next();
};

export const isAdmin = (req, res, next) => {
    const { role } = req.user;console.log(role);

    if (!(/^Admin$/i.test(role) || /^Super(?: |-|_)Admin$/i.test(role))) {
        res.set('WWW-Authenticate', 'Bearer realm="", error="insufficient_scope"');
        return res.status(403).json({ error: 'Admin role needed' });
    }

    next();
};
