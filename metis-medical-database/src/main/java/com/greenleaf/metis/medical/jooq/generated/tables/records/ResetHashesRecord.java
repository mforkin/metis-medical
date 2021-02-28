/*
 * This file is generated by jOOQ.
 */
package com.greenleaf.metis.medical.jooq.generated.tables.records;


import com.greenleaf.metis.medical.jooq.generated.tables.ResetHashes;

import javax.annotation.Generated;

import org.jooq.Field;
import org.jooq.Record1;
import org.jooq.Record2;
import org.jooq.Row2;
import org.jooq.impl.UpdatableRecordImpl;


/**
 * This class is generated by jOOQ.
 */
@Generated(
    value = {
        "http://www.jooq.org",
        "jOOQ version:3.11.5"
    },
    comments = "This class is generated by jOOQ"
)
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class ResetHashesRecord extends UpdatableRecordImpl<ResetHashesRecord> implements Record2<String, String> {

    private static final long serialVersionUID = 149683668;

    /**
     * Setter for <code>public.reset_hashes.hash</code>.
     */
    public void setHash(String value) {
        set(0, value);
    }

    /**
     * Getter for <code>public.reset_hashes.hash</code>.
     */
    public String getHash() {
        return (String) get(0);
    }

    /**
     * Setter for <code>public.reset_hashes.username</code>.
     */
    public void setUsername(String value) {
        set(1, value);
    }

    /**
     * Getter for <code>public.reset_hashes.username</code>.
     */
    public String getUsername() {
        return (String) get(1);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     */
    @Override
    public Record1<String> key() {
        return (Record1) super.key();
    }

    // -------------------------------------------------------------------------
    // Record2 type implementation
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     */
    @Override
    public Row2<String, String> fieldsRow() {
        return (Row2) super.fieldsRow();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Row2<String, String> valuesRow() {
        return (Row2) super.valuesRow();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<String> field1() {
        return ResetHashes.RESET_HASHES.HASH;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<String> field2() {
        return ResetHashes.RESET_HASHES.USERNAME;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String component1() {
        return getHash();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String component2() {
        return getUsername();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String value1() {
        return getHash();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String value2() {
        return getUsername();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public ResetHashesRecord value1(String value) {
        setHash(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public ResetHashesRecord value2(String value) {
        setUsername(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public ResetHashesRecord values(String value1, String value2) {
        value1(value1);
        value2(value2);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached ResetHashesRecord
     */
    public ResetHashesRecord() {
        super(ResetHashes.RESET_HASHES);
    }

    /**
     * Create a detached, initialised ResetHashesRecord
     */
    public ResetHashesRecord(String hash, String username) {
        super(ResetHashes.RESET_HASHES);

        set(0, hash);
        set(1, username);
    }
}
