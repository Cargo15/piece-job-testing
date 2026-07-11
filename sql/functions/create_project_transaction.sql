
DECLARE
    v_project_id UUID;
BEGIN
    INSERT INTO projects (
        customer_id,
        vendor_id,
        product_id,
        title,
        description,
        status
    )
    VALUES (
        p_customer_id,
        p_vendor_id,
        p_product_id,
        p_title,
        p_description,
        'created'
    )
    RETURNING id INTO v_project_id;

    INSERT INTO project_status_history (
        project_id,
        old_status,
        new_status,
        changed_by,
        notes
    )
    VALUES (
        v_project_id,
        NULL,
        'created',
        p_customer_id,
        'Project created'
    );

    RETURN v_project_id;
END;